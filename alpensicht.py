import requests
from dataclasses import dataclass

LOCATIONS = {
    "ulm":       {"lat": 48.3984, "lon":  9.9908, "alt": 480, "label": "Ulm"},
    "garmisch":  {"lat": 47.4912, "lon": 11.0956, "alt": 708, "label": "Garmisch-Partenkirchen"},
    "innsbruck": {"lat": 47.2692, "lon": 11.4041, "alt": 582, "label": "Innsbruck"},
}

BASE_URL = "https://api.open-meteo.com/v1/forecast"
LAPSE    = 0.12  # hPa/m

CURRENT_FIELDS = [
    "temperature_2m", "relative_humidity_2m", "surface_pressure",
    "dew_point_2m", "visibility", "precipitation",
    "wind_speed_10m", "wind_direction_10m",
    "cloud_cover", "cloud_cover_low", "cloud_cover_mid", "cloud_cover_high",
]


@dataclass
class W:
    location: str
    temperature: float
    humidity: float
    pressure: float
    dew_point: float
    visibility: float
    precipitation: float
    wind_speed: float
    wind_direction: float
    cloud_cover: int
    cloud_cover_low: int
    cloud_cover_mid: int
    cloud_cover_high: int


def fetch(name: str, lat: float, lon: float, **_) -> W:
    resp = requests.get(BASE_URL, params={
        "latitude": lat, "longitude": lon,
        "current": CURRENT_FIELDS,
        "wind_speed_unit": "kmh",
        "timezone": "Europe/Berlin",
    }, timeout=10)
    resp.raise_for_status()
    c = resp.json()["current"]
    return W(
        location=name,
        temperature=c["temperature_2m"],
        humidity=c["relative_humidity_2m"],
        pressure=c["surface_pressure"],
        dew_point=c.get("dew_point_2m", 0),
        visibility=c.get("visibility", 0),
        precipitation=c.get("precipitation", 0),
        wind_speed=c["wind_speed_10m"],
        wind_direction=c["wind_direction_10m"],
        cloud_cover=c.get("cloud_cover", 0),
        cloud_cover_low=c.get("cloud_cover_low", 0),
        cloud_cover_mid=c.get("cloud_cover_mid", 0),
        cloud_cover_high=c.get("cloud_cover_high", 0),
    )


def norm_p(pressure: float, altitude: int) -> float:
    return pressure + LAPSE * altitude


def score_t(val: float, thresholds: list[tuple[float, int]]) -> int:
    """Return pts for first threshold val does not exceed."""
    return next(pts for lim, pts in thresholds if val <= lim)


def sym(pts: int, good: int, mid: int = 0) -> str:
    return "[+]" if pts >= good else ("[~]" if pts > mid else "[-]")


# ── Cloud analysis ────────────────────────────────────────────────────────────

def analyze_clouds(ulm: W, gap: W) -> tuple[int, int, list[str]]:
    score, details = 0, []

    specs = [
        # (value, thresholds, max_pts, label)
        (
            max(gap.cloud_cover_low, gap.cloud_cover_mid),
            [(10,50),(25,38),(50,20),(75,8),(100,0)], 50,
            "Garmisch tief+mittel",
        ),
        (
            gap.cloud_cover,
            [(20,20),(40,14),(60,7),(80,2),(100,0)], 20,
            "Garmisch gesamt",
        ),
        (
            ulm.cloud_cover_low,
            [(10,15),(30,10),(55,4),(100,0)], 15,
            "Ulm tief",
        ),
        (
            ulm.cloud_cover_mid,
            [(10,10),(30,7),(60,3),(100,0)], 10,
            "Ulm mittel",
        ),
        (
            ulm.cloud_cover_high,
            [(20,5),(50,3),(80,1),(100,0)], 5,
            "Ulm hoch (Cirrus)",
        ),
    ]

    for val, thresholds, max_pts, label in specs:
        pts = score_t(val, thresholds)
        score += pts
        details.append(
            f"  {sym(pts, thresholds[1][1]+1)} {label}: {val}%"
            f"  ({pts}/{max_pts})"
        )

    gap_critical = max(gap.cloud_cover_low, gap.cloud_cover_mid)
    ulm_critical = max(ulm.cloud_cover_low, ulm.cloud_cover_mid)
    cap_g   = score_t(gap_critical,   [(49,100),(74,50),(89,25),(100,10)])
    cap_uh  = score_t(ulm_critical,   [(49,100),(74,55),(89,30),(100,15)])
    cap_ut  = score_t(ulm.cloud_cover,[(59,100),(79,80),(94,60),(100,45)])
    cap     = min(cap_g, cap_uh, cap_ut)

    reasons = [
        (cap_g,  f"Garmisch tief+mittel {gap_critical}% => cap {cap_g}"),
        (cap_uh, f"Ulm tief+mittel {ulm_critical}% => cap {cap_uh}"),
        (cap_ut, f"Ulm gesamt {ulm.cloud_cover}% => cap {cap_ut}"),
    ]
    active = " | ".join(r for c, r in reasons if c == cap < 100)
    if active:
        details.append(f"  [!] Aktiver Deckel: {active}")

    return score, cap, details


# ── Foehn analysis ────────────────────────────────────────────────────────────

def analyze_foehn(ulm: W, gap: W, ibk: W) -> tuple[float, int, list[str]]:
    ulm_p = norm_p(ulm.pressure, LOCATIONS["ulm"]["alt"])
    gap_p = norm_p(gap.pressure, LOCATIONS["garmisch"]["alt"])
    ibk_p = norm_p(ibk.pressure, LOCATIONS["innsbruck"]["alt"])

    d_ibk_gap = ibk_p - gap_p
    d_ibk_ulm = ibk_p - ulm_p
    t_diff     = gap.temperature - ulm.temperature

    specs = [
        (d_ibk_gap,      [(1,8),(3,18),(5,30),(8,40),(999,40)], 40, 18, f"Gradient IBK->GAP: {d_ibk_gap:+.1f} hPa"),
        (d_ibk_ulm,      [(1,5),(3,10),(6,15),(999,15)],        15, 10, f"Gradient IBK->ULM: {d_ibk_ulm:+.1f} hPa"),
        (t_diff,         [(0,3),(2,6),(4,10),(999,10)],         10,  6, f"Temp GAP ({gap.temperature}°C) - ULM ({ulm.temperature}°C): {t_diff:+.1f}°C"),
        (gap.humidity,   [(40,5),(55,3),(100,0)],                5,  3, f"Feuchte GAP: {gap.humidity}%"),
    ]

    score, details = 0, []
    for val, thresholds, max_pts, good, label in specs:
        pts = score_t(val, thresholds)
        score += pts
        details.append(f"  {sym(pts, good)} {label}  ({pts}/{max_pts})")

    for pts, cond, label, wind, speed, loc in [
        (20, 120 <= gap.wind_direction <= 230,
            "Wind GAP", gap.wind_direction, gap.wind_speed, ""),
        (10, 135 <= ulm.wind_direction <= 235,
            "Wind ULM", ulm.wind_direction, ulm.wind_speed, ""),
    ]:
        p = pts if cond else 0
        score += p
        direction = "Sued" if cond else "kein Sued"
        details.append(
            f"  {sym(p, pts)} {label}: {wind:.0f}° {speed:.0f} km/h"
            f"  [{direction}wind]  ({p}/{pts})"
        )

    return d_ibk_gap, score, details


# ── Master evaluation ─────────────────────────────────────────────────────────

def evaluate(ulm: W, gap: W, ibk: W) -> dict:
    _, foehn_score, foehn_details = analyze_foehn(ulm, gap, ibk)
    cloud_score, cloud_cap, cloud_details = analyze_clouds(ulm, gap)

    score, factors = 0, []

    sections = [
        # label, raw_score, weight, max_weighted, sub_details, cap_info
        ("Wolken",  cloud_score, 0.30, 30, cloud_details,
         f"  [!] Deckel aktiv: max. {cloud_cap} Punkte" if cloud_cap < 100 else None),
        ("Foehn",   foehn_score, 0.10, 10, foehn_details, None),
    ]

    for label, raw, weight, max_w, sub, cap_note in sections:
        weighted = round(raw * weight)
        score   += weighted
        factors.append(
            f"  --- {label}: {raw}/100  =>  gewichtet {weighted}/{max_w}"
        )
        factors += sub
        if cap_note:
            factors.append(cap_note)

    dew = ulm.dew_point
    dew_specs = [
        (0,"extrem trocken",30),(5,"sehr trocken",26),(8,"trocken",19),
        (12,"maessig",10),(15,"leicht feucht",4),(999,"zu feucht",0),
    ]
    pts, label = next((p, l) for lim, l, p in dew_specs if dew <= lim)
    score += pts
    factors.append(f"  {sym(pts,19,0)} Taupunkt ULM: {dew:.1f}°C  [{label}]  ({pts}/30)")

    vis_km = ulm.visibility / 1000
    pts = score_t(vis_km, [(30,0),(50,6),(80,12),(999,18)])
    score += pts
    factors.append(f"  {sym(pts,12,0)} Sicht ULM: {vis_km:.0f} km  ({pts}/18)")

    pts = score_t(ulm.humidity, [(30,7),(45,5),(60,2),(100,0)])
    score += pts
    factors.append(f"  {sym(pts,5,0)} Feuchte ULM: {ulm.humidity}%  ({pts}/7)")

    if ulm.precipitation == 0:
        score += 5
        factors.append("  [+] Kein Niederschlag ULM  (5/5)")
    else:
        factors.append(f"  [-] Niederschlag ULM: {ulm.precipitation} mm  (0/5)")

    capped = score > cloud_cap
    score  = min(score, cloud_cap)

    verdict = next(v for thr, v in [
        (70, "JA          – Alpensicht sehr wahrscheinlich"),
        (50, "WAHRSCHEINL – Gute Chancen auf Alpensicht"),
        (35, "MOEGLICH    – Alpensicht nicht ausgeschlossen"),
        (20, "EHER NEIN   – Bedingungen unguenstig"),
        (-1, "NEIN        – Keine Alpensicht"),
    ] if score >= thr)

    return {
        "verdict":    verdict,
        "score":      score,
        "score_note": f" (Deckel: {cloud_cap})" if capped else "",
        "factors":    factors,
    }


# ── Output ────────────────────────────────────────────────────────────────────

TABLE_ROWS: list[tuple[str, callable]] = [
    ("Temperatur    (°C)",  lambda s: f"{s.temperature}"),
    ("Taupunkt      (°C)",  lambda s: f"{s.dew_point:.1f}"),
    ("Feuchte         (%)", lambda s: f"{s.humidity}"),
    ("Luftdruck     (hPa)", lambda s: f"{s.pressure:.1f}"),
    ("Druck norm.   (hPa)", lambda s: f"{norm_p(s.pressure, LOCATIONS[s.location]['alt']):.1f}"),
    ("Wind         (km/h)", lambda s: f"{s.wind_speed:.0f}"),
    ("Windrichtung    (°)", lambda s: f"{s.wind_direction:.0f}"),
    ("Sichtweite    (km)",  lambda s: f"{s.visibility/1000:.0f}"),
    ("Niederschlag  (mm)",  lambda s: f"{s.precipitation}"),
    ("Wolken gesamt  (%)",  lambda s: f"{s.cloud_cover}"),
    ("Wolken tief    (%)",  lambda s: f"{s.cloud_cover_low}"),
    ("Wolken mittel  (%)",  lambda s: f"{s.cloud_cover_mid}"),
    ("Wolken hoch    (%)",  lambda s: f"{s.cloud_cover_high}"),
]

W_ = 22
COL = 12


def hr(char: str = "-", width: int = 60) -> None:
    print(char * width)


def print_weather_table(stations: list[W]) -> None:
    labels = [LOCATIONS[s.location]["label"] for s in stations]
    print(f"  {'':>{W_}}", "".join(f"{l:>{COL}}" for l in labels))
    hr()
    for label, fn in TABLE_ROWS:
        print(f"  {label:>{W_}}", "".join(f"{fn(s):>{COL}}" for s in stations))


def main():
    hr("=", 60)
    print("  ALPENSICHT VON ULM / Zugspitz-Korridor")
    hr("=", 60)
    print("  Lade Wetterdaten ...")
    print()

    try:
        ulm       = fetch("ulm",       **LOCATIONS["ulm"])
        garmisch  = fetch("garmisch",  **LOCATIONS["garmisch"])
        innsbruck = fetch("innsbruck", **LOCATIONS["innsbruck"])
    except requests.RequestException as e:
        print(f"  Fehler: {e}")
        return

    result = evaluate(ulm, garmisch, innsbruck)

    hr()
    print(f"  ERGEBNIS : {result['verdict']}")
    print(f"  SCORE    : {result['score']}/100{result['score_note']}")
    hr()
    print("  ANALYSE")
    hr()
    for f in result["factors"]:
        print(f)
    print()
    hr()
    print("  ROHDATEN")
    hr()
    print_weather_table([ulm, garmisch, innsbruck])
    print()


if __name__ == "__main__":
    main()
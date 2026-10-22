# SWU Mobility API – Reverse-Engineered Reference

Stadtwerke Ulm/Neu-Ulm (SWU) public transport API. Free, CC-0 licensed, no API key.

- Landing page: <https://api.swu.de/mobility>
- Machine-readable self-description: <https://api.swu.de/mobility/v1/VersionInfo>
- Base URL: `https://api.swu.de/mobility/v1`
- Contact: verkehrstechnik@swu.de
- Version `1.0.2`, published 2021-07-01, last update 2022-05-02 (the changelog only lists the 1.0 release).

Everything below was checked against the live API on **2026-10-02 (Fri, ~15:10 CEST)**. Raw responses are saved in `swu_raw/`.
Anything marked **⚠ undocumented** isn't on the public page or in `VersionInfo`.

---

## 1. General behaviour

| Topic | Behaviour |
|---|---|
| Method | `GET` only |
| Auth | none |
| CORS | `Access-Control-Allow-Origin: *`, so a browser can call it directly with no proxy |
| Caching | `Cache-Control: no-store, no-cache` |
| Format | JSON, UTF-8. Each response is wrapped in one root object (e.g. `{"VehicleTrip": {...}}`) |
| Timestamps | ISO-8601 with local offset, e.g. `2026-10-02T15:10:07+02:00` (Europe/Berlin), resolution 1 s |
| Coordinates | WGS84 decimal degrees (`Longitude`, `Latitude`). `Bearing` = degrees 0–359 |
| Path case | **Case-sensitive**: `/stop/passage/departures` returns 404 |
| Parameter names | **Case-sensitive**: `stopnumber=` is ignored ("no StopNumber set") |
| Parameter values | `ContentScope` values are case-insensitive (`extended`, `EXTENDED` both work) |
| Lists in params | Not supported. `VehicleNumber=161,41` silently uses only `161` |
| Unknown params | Silently ignored (e.g. `RouteNumber` on Departures does **not** filter) |
| Errors | **Always HTTP 200.** Check `CurrentStatus` (base data / Trip) or `State` (passages / pattern) |
| Latency | ~0.6 s for the full `Trip` list (30 KB) |

### Response envelope

Every response has a metadata block next to the data array:

```json
{
  "VehicleTrip": {
    "ServiceCategory": "Trip",
    "UpdateInterval": "15 seconds",
    "Filter": "None",                // or the filter value used, e.g. 161
    "ContentScope": "Standard",
    "OrderedBy": "VehicleNumber ascending",
    "CurrentStatus": "OK",           // base data + Trip use CurrentStatus …
    "CurrentTimestamp": "2026-10-02T15:10:11+02:00",
    "TripData": [ ... ]
  }
}
```

Passage/Pattern endpoints use `"State": "ok"` instead of `CurrentStatus`.

### ⚠ Gotcha: a single filtered result is an object, not an array

If you filter base data or `Trip` down to one item (`?VehicleNumber=161`, `?StopNumber=1008`, …), the data key (`TripData`, `StopData`, `VehicleData`, `StopPointData`) holds **a single object instead of a one-element list**. Normalise it:

```js
const asArray = x => x == null ? [] : Array.isArray(x) ? x : [x];
```

`RouteData` with `?RouteNumber=` is the exception. It stays a list, because a route can have several entries.

### Error / empty states observed

| Message | Field | Cause |
|---|---|---|
| `OK` / `ok` | CurrentStatus / State | success |
| `no result found` | CurrentStatus | unknown ID, or invalid `ContentScope` value |
| `no StopNumber set` | State | missing or wrongly cased required parameter |
| `no VehicleNumber set` | State | missing required parameter |
| `no stop found` | State | unknown StopNumber |
| `no StopPoint found` | State | unknown StopPointCode (incl. 6-digit codes, see §3) |
| `no departures found` | State | e.g. `Limit=0`, or nothing in the next ~2 h |
| `no Passage found` | State | vehicle not on a trip right now (Passage & Pattern) |

When there's no data, the data array key is **missing entirely** (not `[]`).

---

## 2. Code tables (from `VersionInfo.UsedCodes`)

| RouteCategory / VehicleCategory | Meaning |
|---|---|
| `1` | Tram (Straßenbahn) |
| `5` | Bus |
| `null` | ⚠ a few vehicles have no category (see §6) |

| PassageStatus | Meaning |
|---|---|
| `1` | Vehicle predicted (prognosis, not yet arriving) |
| `2` | Vehicle arriving |
| `3` | Vehicle stopping (at the platform now) |
| `4` | Vehicle departed |
| `5` | Vehicle passed (drove through without stopping) |

`Direction` is `1` or `2`. The names come from `RouteDirections` (see §5). Direction 1 is *not* consistently "outbound". It's just SWU's internal convention per line.

---

## 3. Identifiers: how everything links together

```
Route (RouteNumber) ──RoutePattern──► StopPoint (StopPointCode) ──ParentStop──► Stop (StopNumber)
Vehicle (VehicleNumber) ──Trip.JourneyData.RouteNumber──► Route
```

| ID | Type | Example | Notes |
|---|---|---|---|
| `RouteNumber` | int | `5`, `101`, `901` | **Internal key. Not what you show to passengers.** Use `RouteName` for display |
| `RouteName` | string | `"5"`, `"N1"`, `"-"` | Public line label |
| `StopNumber` | int, 4 digits | `1008` | Hauptbahnhof. Range 1000–9995 |
| `StopCode` | string | `"HBF"` | Short mnemonic code (≤4 chars) |
| `StopPointCode` | **string** (docs say integer) | `"de:08421:1008:1:2"` | Platform ID, see below |
| `StopPointNumber` | int | `2` | Platform index *within* its stop |
| `VehicleNumber` | int | `41` | Fleet number (also printed on the vehicle) |

### StopPointCode comes in two formats ⚠

The docs say "6-digit code", but the API now mostly uses **DHID** (the German national stop ID, `de:<AGS>:<stop>:<area>:<platform>`):

- **797 platforms**: DHID, e.g. `de:08421:1008:1:2`
  - `08421` = Stadtkreis Ulm (Baden-Württemberg), `09775` = Landkreis Neu-Ulm (Bavaria), `08425` = Alb-Donau-Kreis
  - The 3rd segment is the `StopNumber`
- **31 platforms**: legacy 6-digit code `SSSSNN` = `StopNumber` + 2-digit `StopPointNumber` (e.g. `100821` = stop 1008, platform 21). These are almost all **Ersatzhalte** (replacement stops for construction/SEV), turning loops and dispatch points:
  `Hauptbahnhof Ersatzhalt A/B`, `Justizgebäude Ersatzhalt`, `Ostpreußenweg Ersatz sta`, `Ersatzhaltestelle Eichenplatz`, `Leonberger Weg Ersatz`, `Ersatzhalt Eggingen`, `Ersatz Illerkirchberger Straße`, `Ersatzhalt Romy-Schneider-Str`, `Adenauerbrücke Steig B/C (FWD)`, `Lehrer Tal Steig C für Dispo`, `Wendeanlage Zeitblomstr`, …

Behaviour differences:

| Endpoint | 6-digit code | DHID |
|---|---|---|
| `/stoppoint/attributes/BaseData?StopPointCode=` | works (only on `minimal`/`basic`, they don't exist in `extended`) | **filter broken**: `Filter: 0` and the full list comes back. Filter client-side |
| `/stoppoint/passage/Departures|Arrivals?StopPointCode=` | **`no StopPoint found`** | works (URL-encode the `:` → `%3A`) |

**Rule of thumb:** use DHIDs, and for live boards prefer `/stop/passage/*` with the `StopNumber`, then group by `StopPointCode`/`PlatformName` client-side.

---

## 4. Base data endpoints (update every 24 h, cache them)

All accept `ContentScope=minimal|basic|extended` (default: `basic`).

### 4.1 Routes – `GET /route/attributes/BaseData`

Params: `RouteNumber` (optional), `ContentScope`.

| Scope | Content |
|---|---|
| minimal | `RouteNumber`, `RouteName`, `RouteCategory` |
| basic | + `RouteDirections[] {Direction, DirectionName}` |
| extended | + `RoutePattern[] {PatternDirection, StopPoints[] {StopNumber, StopCode, StopName, StopPointNumber, StopPointCode, PlatformName, StopPointName}}` |

```json
{ "RouteNumber": 1, "RouteName": "1", "RouteCategory": 1,
  "RouteDirections": [ {"Direction": 1, "DirectionName": "Böfingen"},
                       {"Direction": 2, "DirectionName": "Söflingen"} ],
  "RoutePattern": [ {"PatternDirection": 1, "StopPoints": [ {"StopNumber": 1300, "StopCode": "SOEF",
      "StopName": "Söflingen", "StopPointNumber": 1, "StopPointCode": "de:08421:1300:1:11",
      "PlatformName": "A", "StopPointName": "Söflingen Steig A"}, ... ] } ] }
```

Notes:
- **No colour here.** Colour only shows up in the live Pattern endpoint (§7.3) ⚠.
- `DirectionName` is **truncated to 12 chars** (`"Grimmelfinge"`, `"Blautal-Cent"`, `"Sc. Park 2"`). Use live `DepartureDirectionText` for proper headsigns.
- A route has **several patterns per direction** (variants: short runs, depot runs, via-variants). Line 1 and line 13 have **exact duplicates**, so dedupe them.
- Pattern stop lists have **no coordinates**. Join with the stop/stoppoint data via `StopPointCode`.
- No geometry (polyline) in base data. Only the live Pattern `Track` has that.

### 4.2 Stops – `GET /stop/attributes/BaseData`

Params: `StopNumber` (optional), `ContentScope`.

| Scope | Count | Content |
|---|---|---|
| minimal | 350 | `StopNumber, StopCode, StopName, StopCoordinates{Longitude, Latitude}` |
| basic | 350 | + `StopPoints[] {StopPointNumber, StopPointCode, PlatformName, StopPointName, StopPointCoordinates{Longitude, Latitude, Bearing}}` |
| extended | **234** ⚠ | + `StopAnnouncement` (MP3 URL) + per platform `ServicingRoutes[] {RouteNumber, RouteName}` |

⚠ **`extended` is a filtered subset**: it drops stops and platforms that no route currently serves (depots like `Betriebshof M10`, `BMK Betriebshof`, Ersatzhalte, out-of-network stops). So `extended` is smaller than `basic`. Example: stop 1701 has 5 platforms in `basic` but 3 in `extended`.

`StopAnnouncement` ⚠ is an MP3 of the in-vehicle stop announcement:
`https://api.swu.de/mobility/files/announcements/announcement1701.mp3` (audio/mpeg, works, directory listing is 403).

`PlatformName` values: `A`–`O`, `X`, `BHF`, or **empty string** (62 platforms).

### 4.3 Stop points (platforms) – `GET /stoppoint/attributes/BaseData`

Params: `StopPointCode` (optional, see §3 caveats), `ContentScope`.

| Scope | Count | Content |
|---|---|---|
| minimal | 828 | platform + `StopPointCoordinates{Longitude, Latitude, Bearing}` |
| basic | 828 | + `ParentStop {StopNumber, StopCode, StopName, StopCoordinates}` |
| extended | **493** ⚠ | + `ServicingRoutes[]`. Again only served platforms, DHIDs only |

`Bearing` is the direction a vehicle faces when stopped at that platform. Handy for working out direction at a stop.

### 4.4 Vehicles – `GET /vehicle/attributes/BaseData`

Params: `VehicleNumber` (optional), `ContentScope`. 194 vehicles.

| Scope | Content |
|---|---|
| minimal | `VehicleNumber, VehicleCategory, VehicleName` |
| basic | + `ModelData{Make, Model}`, `CapacityData{Seats, StandingSpaces, WheelChairSpaces}` |
| extended | + `TechnicalData{Doors, Length(mm), Width(mm), Height(mm), EmptyWeight(kg), MaximumWeight(kg), Power(kw)}` |

Many technical fields are `null`. Note the keys contain parentheses: `v.TechnicalData["Length(mm)"]`.

---

## 5. Route catalogue (as of 2026-10-02)

24 entries in `RouteData`. Colours are from the live Pattern endpoint (`RouteColor`) and only come back while a vehicle is running on that route.

| RouteNumber | RouteName (display) | Category | Directions (1 / 2) | Colour | Meaning |
|---|---|---|---|---|---|
| 1 | 1 | Tram | Böfingen / Söflingen | `rgb(237,27,36)` `#ED1B24` | Tram line 1 |
| 2 | 2 | Tram | Sc. Park 2 / Kuhberg | `rgb(55,179,85)` `#37B355` | Tram line 2 |
| 4 | 4 | Bus | Böfingen / Wiblingen | `rgb(1,128,109)` `#01806D` | |
| 5 | 5 | Bus | Eselsberg / Neu-Ulm | `rgb(26,168,190)` `#1AA8BE` | |
| 6 | 6 | Bus | Hasenkopf / Donaustadion | `rgb(247,149,52)` `#F79534` | |
| 7 | 7 | Bus | Jungingen / W.-Brandt-Pl | `rgb(177,0,106)` `#B1006A` | |
| 8 | 8 | Bus | Eselsberg / Grimmelfinge(n) | `rgb(118,64,140)` `#76408C` | |
| 9 | 9 | Bus | Gleißelstett(en) / Roter Berg | `rgb(223,156,187)` `#DF9CBB` | |
| 10 | 10 | Bus | Blautal-Cent(er) / Donautal | `rgb(165,161,88)` `#A5A158` | |
| 11 | 11 | Bus | B311 / Söflingen | `rgb(0,93,163)` `#005DA3` | Ring line, ZOB→ZOB, headsign "Ringverkehr" |
| 12 | 12 | Bus | Unterweiler / Ulm | `rgb(178,44,43)` `#B22C2B` | |
| 13 | 13 | Bus | Mähringen / Jungingen | `rgb(122,196,165)` `#7AC4A5` | |
| 14 | 14 | Bus | Kuhberg / Wiblingen | `rgb(0,173,239)` `#00ADEF` | |
| 15 | 15 | Bus | Eselsberg / W.-Brandt-Pl | `rgb(179,130,186)` `#B382BA` | |
| **101** | **1** | **Bus** | Böfingen / Söflingen | not seen yet | **SEV for tram 1** ⚠ |
| **102** | **2** | **Bus** | Eselsberg / Kuhberg | not seen yet | **SEV for tram 2** ⚠ |
| 201 | `-` | Tram | Böfingen / Söflingen | not seen yet | Tram 1 network, no public name (likely Betriebs-/Sonderfahrt, see §11) |
| 202 | `-` | Tram | Eselsberg / Kuhberg | not seen yet | Tram 2 network, no public name (as above) |
| 901 | N1 | Bus | Einsingen / ZOB | not seen yet | Night bus (Nachtbus, weekend nights) |
| 902 | N2 | Bus | Eselsberg / ZOB | not seen yet | Night bus |
| 903 | N3 | Bus | Jungingen / ZOB | not seen yet | Night bus |
| 904 | N4 | Bus | Böfingen / ZOB | not seen yet | Night bus |
| 907 | N7 | Bus | Unterweiler / ZOB | not seen yet | Night bus |
| 908 | N8 | Bus | Donaustetten / ZOB | not seen yet | Night bus |

There's no line 3 and no N5/N6. Regional DING lines operated by other companies aren't in this API.

`RouteSymbol` ⚠ is a pictogram filename like `Linie_5_Pikto.gif`. The image itself **wasn't found** on api.swu.de (tried ~25 paths under `/mobility/files/…`). Build the badges yourself from `RouteColor` + `RouteName`.

### RouteNumber numbering scheme ⚠

| Range | Meaning |
|---|---|
| 1–99 | Regular lines (`RouteName == String(RouteNumber)`) |
| 101–199 | **SEV (Schienenersatzverkehr)**: replacement bus for tram line `RouteNumber − 100`. `RouteName` is the tram's name, `RouteCategory = 5` |
| 201–299 | Tram-category variants of tram line `RouteNumber − 200`, `RouteName = "-"` |
| 901–999 | Night lines, `RouteName = "N" + (RouteNumber − 900)` |

### How to detect SEV

There's no explicit SEV flag in the API. Derive it:

```js
const isSEV = r => r.RouteNumber >= 101 && r.RouteNumber <= 199;   // primary rule
// Fallback (catches any future scheme): a bus on a route whose name belongs to a tram line
const tramNames = new Set(routes.filter(r => r.RouteCategory === 1).map(r => r.RouteName));
const isSEVFallback = (routeNumber, routeName, category) => category === 5 && tramNames.has(routeName);
```

Live data carries `RouteNumber`, so the rule works on departures, trips, and passages. Signs of SEV in stop data: 6-digit `StopPointCode`s / names containing `Ersatz` (Ersatzhalt = SEV replacement stop). Example: the 101 pattern starts at `de:08421:1350:1:C` (Ehinger Tor, bus platform) instead of the tram platform.

### Tram vs bus

- Line level: `RouteCategory` (base data).
- Per departure: `VehicleCategory`. ⚠ This is `null` when no vehicle is assigned yet (most departures more than ~20 min out), so **fall back to `RouteCategory` by `RouteNumber`**.

---

## 6. Fleet (194 vehicles)

| VehicleNumber | Category | Make / Model | Notes |
|---|---|---|---|
| 1, 10, 13, 16 | Tram | Maschinenfabrik Esslingen / MAN / Linder | historic & service vehicles (10 = "Gerhard Späth") |
| 41–50 | Tram | Siemens Combino NGT 6 UL | named (e.g. 41 "Albrecht Berblinger") |
| 51–68 | Tram | Siemens Avenio M NGT 6 UL | named (e.g. 53 "Anna Essinger") |
| 100–199 | Bus | Mercedes O530 / O530G / G2 / Hybrid | articulated city buses |
| 301–307 | Bus | Mercedes eCitaro | 12 m electric |
| 401, 402, 452, 461, 462 | **null** | Setra / Mercedes | no category ⚠ |
| 601–637 | Bus | Mercedes eCitaro G | articulated electric (622–624 have category `null`) |
| 721–754 | Bus | Mercedes O530 variants | |
| 900–992 | Bus | Mercedes / Setra / MAN Lion's City / Iveco Daily | probably subcontractor buses (Subunternehmer) |

Only trams have `VehicleName`s, which are famous Ulm people. Some names have trailing spaces (`"Max Eyth "`), so `.trim()` them.

---

## 7. Live data (UpdateInterval "15 seconds")

### 7.1 All vehicles – `GET /vehicle/trip/Trip`

Optional `VehicleNumber`. Without it you get **all 194 vehicles** (~30 KB), so one request is enough to draw a live map.

Inactive vehicle:
```json
{ "VehicleNumber": 1, "VehicleCategory": 1, "IsActive": false }
```
Active vehicle:
```json
{ "VehicleNumber": 161, "VehicleCategory": 5, "IsActive": true,
  "PositionData": { "Longitude": 10.01013, "Latitude": 48.38792, "Bearing": 83 },
  "TimeData":     { "Deviation": -860, "ReferenceTime": "2026-10-02T15:10:44+02:00" },
  "JourneyData":  { "RouteNumber": 5, "ArrivalDirectionText": "Universität Süd",
                    "DepartureDirectionText": "Wiley", "Direction": 2 } }
```

- `PositionData`, `TimeData`, and `JourneyData` are **absent** when `IsActive` is false.
- `ReferenceTime` is when the vehicle's position/time was last reported. Each vehicle reports about **every 16 s** on its own cycle (measured), not in sync with other vehicles. Compare it with `CurrentTimestamp` to get the data's age.
- `ArrivalDirectionText` = where the trip came from (origin). `DepartureDirectionText` = headsign/destination. One of them is `""` at a terminus. Headsigns can carry a "via", e.g. `"Böf. Süd ü L-Beck-St."`, `"Böf. Süd ü. Eichberg"`.
- No `RouteName` here. Look it up from base data by `RouteNumber`.

#### ⚠ `Deviation` sign is OPPOSITE between endpoints

| Endpoint | Field | Late bus is… | Resolution |
|---|---|---|---|
| `/vehicle/trip/Trip` | `TimeData.Deviation` | **negative** (−860 = 14 min 20 s late) | rounded to **10 s** |
| `/vehicle/trip/Passage`, `/stop*/passage/*` | `ArrivalDeviation` / `DepartureDeviation` | **positive** (+868 = 14 min 28 s late) | 1 s |

Verified on vehicle 161 at the same moment: Trip −860 vs Passage +868 / +878.
In passages, `Deviation = TimeActual − TimeScheduled` (in seconds).

### 7.2 One vehicle's stop list – `GET /vehicle/trip/Passage`

Required `VehicleNumber`. Optional `Range=All` (default) or **`Range=Upcomming`** (sic: it only recognises the misspelled value, case-insensitive. `Upcoming` silently falls back to `All` ⚠).

Header has `VehicleNumber, VehicleCategory, RouteNumber, RouteName, Range`. Each `PassageData[]` item:

```json
{ "StopNumber": 1248, "StopCode": "HOCH", "StopName": "Technische Hochschule",
  "StopPointNumber": 1, "StopPointCode": "de:08421:1248:0:11", "PlatformName": "B",
  "StopPointName": "Technische Hochschule Steig B",
  "ArrivalDirectionText": "Universität Süd",
  "ArrivalTimeScheduled": "2026-10-02T14:21:00+02:00",
  "ArrivalTimeActual":    "2026-10-02T14:24:52+02:00",
  "ArrivalCountdown": -2751, "ArrivalDeviation": 232,
  "DepartureDirectionText": "Wiley",
  "DepartureTimeScheduled": "2026-10-02T14:21:00+02:00",
  "DepartureTimeActual":    "2026-10-02T14:25:03+02:00",
  "DepartureCountdown": -2740, "DepartureDeviation": 243,
  "Status": 4, "SequenceNumber": 5 }
```

- Covers **the current trip only**, start to end. Past stops have `Status 4` and real (measured) `…Actual` times to the second. Future stops have `Status 1` and predicted `…Actual` times.
- Scheduled times are on full minutes. Actual times are to the second.
- `Countdown = TimeActual − CurrentTimestamp` in seconds (negative = in the past).
- `SequenceNumber` can have **gaps** (0, 5, 6, 7, …). They seem to index the pattern including non-served points, so sort by it but don't treat it as a contiguous index.
- First stop: `ArrivalDirectionText = ""`. Last stop: `DepartureDirectionText` stays the headsign.
- Between trips: `State: "no Passage found"`.

### 7.3 One vehicle's route geometry and colour – `GET /vehicle/trip/Pattern` ⚠ hidden fields

Required `VehicleNumber`. `ContentScope=Stops` (default) | `Track` | `Carriageway` (= Stops + Track).

Header contains two fields **not in any docs**:

```json
"RouteColor":  "rgb(26,168,190)",
"RouteSymbol": "Linie_5_Pikto.gif"
```

Data:
- `PatternData.StopPoints[]`: stops of the current trip, with `StopPointCoordinates {Longitude, Latitude, Bearing}`.
- `PatternData.TrackPoints[] {SequenceNumber, Longitude, Latitude}`: the polyline (~550 points for line 5). `SequenceNumber` is a **segment number shared by many points** (1…50 for 552 points), not a per-point index. Keep the array order.

This is the **only** way to get line colours and the drawn route shape. Strategy: whenever a new `RouteNumber` shows up in `Trip`, call `Pattern?VehicleNumber=<a vehicle on it>&ContentScope=Carriageway` once and cache colour + track per `(RouteNumber, Direction, first/last stop)`.

### 7.4 Stop departure/arrival boards

| Endpoint | Required | Recommended |
|---|---|---|
| `GET /stop/passage/Departures` | `StopNumber` (4 digits) | `Limit` |
| `GET /stop/passage/Arrivals` | `StopNumber` | `Limit` |
| `GET /stoppoint/passage/Departures` | `StopPointCode` (**DHID**, URL-encoded) | `Limit` |
| `GET /stoppoint/passage/Arrivals` | `StopPointCode` (**DHID**) | `Limit` |

```json
{ "StopPointNumber": 2, "StopPointCode": "de:08421:1008:1:2", "PlatformName": "A",
  "VehicleNumber": 185, "VehicleCategory": 5, "RouteNumber": 7, "RouteName": "7",
  "Status": 1, "DepartureDirectionText": "Kasernstraße",
  "DepartureTimeScheduled": "2026-10-02T15:08:00+02:00",
  "DepartureTimeActual":    "2026-10-02T15:11:57+02:00",
  "DepartureCountdown": 9, "DepartureDeviation": 237 }
```

Arrivals use the same shape with `Arrival*` fields (the stop-level one also has `StopPointCode`/`PlatformName`).

Observed behaviour:
- **Default `Limit` is 999.** The board covers roughly the **next 2 hours** (HBF: 124 departures, last one at +7183 s).
- Sorted by **actual** (predicted) time, not scheduled.
- `VehicleNumber`/`VehicleCategory` are **`null`** for trips that don't have a vehicle yet (80% of HBF's 2-hour board). Even those can have a predicted `…Actual` time that differs from schedule (the delay carries over from the vehicle's previous trip).
- Departures that already left drop off the board quickly. Entries with a small negative countdown (−6 … −21 s) and `Status 3` (stopping) still show up.
- ⚠ `/stoppoint/passage/*` header fields `StopPointNumber`, `StopPointCode`, `PlatformName`, `StopPointName` come back as `null` (bug). Take them from base data.
- `RouteNumber=` filter is **ignored**. Filter client-side.
- `ContentScope` is ignored (always `Standard`).

---

## 8. Building a seconds-accurate web UI

1. **Load base data once a day** (`route` extended, `stop` basic + extended, `stoppoint` basic, `vehicle` basic). Build maps:
   `routeByNumber`, `stopByNumber`, `stopPointByCode`, `vehicleByNumber`.
2. **Clock sync.** Every response has `CurrentTimestamp`. Store `offset = Date.parse(CurrentTimestamp) − Date.now()` (plus ~RTT/2). Server and real time matched within 1 s in tests, but users' clocks may not.
3. **Countdown ticking.** Don't trust `…Countdown` after the response arrives. Compute it locally every second:
   `countdown = Date.parse(DepartureTimeActual) − (Date.now() + offset)`.
4. **Polling.** Data refreshes every 15 s (vehicles report every ~16 s each). Poll boards/Trip every **10–15 s**. Faster just gives the same data.
5. **Smooth vehicle movement.** Between polls, move markers along the cached `TrackPoints` polyline instead of jumping. Use `ReferenceTime` (not the poll time) as the timestamp of each position.
6. **Delay display.** Use passage `DepartureDeviation` (seconds, + = late). If you use Trip, **negate** `TimeData.Deviation`.
7. **Line badge.** `RouteName` + colour from the `RouteColor` cache (fallback table in §5). Tram/bus from `RouteCategory`. SEV via the `101–199` rule (§5). For SEV badges, the usual convention is the tram line's number on a bus-style badge, e.g. a "SEV 1" label in the tram's colour. **Its real colour is unconfirmed**: capture `RouteColor` the first time a 101/102 vehicle runs.
8. **Normalise** single-object-vs-array (§1) and `null` vehicle fields.
9. **Endpoints / termini.** `DepartureDirectionText` = headsign. Full termini come from the first/last `StopPoints` of each `RoutePattern` (base data) or the live Pattern/Passage of a running vehicle.

---

## 9. Undocumented / hidden findings (summary)

1. `RouteColor` + `RouteSymbol` in `/vehicle/trip/Pattern`. The only source of line colours.
2. RouteNumber scheme: `1xx` = SEV, `2xx` = unnamed tram variants (`"-"`), `9xx` = night lines `N*`.
3. `StopAnnouncement` MP3 files per stop (`/mobility/files/announcements/announcement<StopNumber>.mp3`).
4. `Deviation` sign differs between Trip (negative = late, 10 s steps) and passages (positive = late, 1 s).
5. `Range=Upcomming` (misspelled) is the only working value. `Upcoming` silently returns all.
6. StopPointCodes are DHIDs now (the docs say 6-digit integers). The leftover 6-digit codes are mostly Ersatzhalte, and live endpoints don't accept them.
7. `ContentScope=extended` on stop/stoppoint returns **fewer** items (only currently served ones) plus `ServicingRoutes`.
8. Single filtered result comes back as an object instead of an array.
9. Errors are HTTP 200 with a text `State`/`CurrentStatus`. Empty results drop the data key.
10. Default `Limit` = 999 (~2 h horizon).
11. `/stoppoint/attributes/BaseData?StopPointCode=<DHID>` ignores the filter (`Filter: 0`).
12. `/stoppoint/passage/*` headers return `null` for the platform fields.
13. Trams have names (`VehicleName`); some vehicles have `VehicleCategory: null`.
14. CORS is open (`*`), so the API can be called straight from the browser.
15. `api.swu.de` also has `/sharing/` (carsharing API) and an announced (not live) charging-station API.

---

## 10. Quick reference

```
GET /VersionInfo
GET /route/attributes/BaseData      [RouteNumber] [ContentScope=minimal|basic|extended]
GET /stop/attributes/BaseData       [StopNumber]  [ContentScope]
GET /stoppoint/attributes/BaseData  [StopPointCode] [ContentScope]
GET /vehicle/attributes/BaseData    [VehicleNumber] [ContentScope]

GET /vehicle/trip/Trip              [VehicleNumber]
GET /vehicle/trip/Passage           VehicleNumber [Range=All|Upcomming]
GET /vehicle/trip/Pattern           VehicleNumber [ContentScope=Stops|Track|Carriageway]
GET /stop/passage/Departures        StopNumber [Limit]
GET /stop/passage/Arrivals          StopNumber [Limit]
GET /stoppoint/passage/Departures   StopPointCode(DHID) [Limit]
GET /stoppoint/passage/Arrivals     StopPointCode(DHID) [Limit]

GET /mobility/files/announcements/announcement<StopNumber>.mp3
```

---

## 11. Open questions

- **Colours of 101/102 (SEV), 201/202 and N1–N8.** They only come from `Pattern` while one of those runs. Night lines run on weekend nights, so poll `Trip` then.
- **Meaning of 201/202 (`RouteName "-"`).** Same stops as tram 1/2. Possibly empty runs, driver training, or extra/special services. Watch whether they ever show up on public departure boards.
- **Where the `RouteSymbol` GIFs live.**
- **Disruption messages.** No messages/alerts endpoint was found (`/messages`, `/disruption`, etc. all 404).
- **Status 2 and 5** (arriving / passed) never showed up in the samples.

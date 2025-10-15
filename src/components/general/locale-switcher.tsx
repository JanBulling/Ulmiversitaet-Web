import { useLocale } from "next-intl";
import LocaleSelector from "./locale-selector";
import { routing } from "@/i18n/routing";
import { SelectItem } from "@/ui/select";
import Image from "next/image";

export default function LocaleSwitcher({
  className,
}: React.ComponentProps<"button">) {
  const locale = useLocale();

  return (
    <div className={className}>
      <LocaleSelector defaultValue={locale}>
        {routing.locales.map((loc) => (
          <SelectItem key={loc} value={loc}>
            <Image
              alt={loc}
              src={`/icons/flags/${loc}.svg`}
              width={24}
              height={18}
              className="shrink-0"
            />
          </SelectItem>
        ))}
      </LocaleSelector>
    </div>
  );
}

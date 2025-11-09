import { useI18n } from "@/contexts/I18nContext";
import { Separator } from "@/components/ui/separator";

interface FooterProps {
  variant?: "default" | "minimal";
}

export const Footer = ({ variant = "default" }: FooterProps) => {
  const { t, dir } = useI18n();

  if (variant === "minimal") {
    return (
      <footer className="bg-primary border-t border-primary/20 mt-auto">
        <div className="container mx-auto px-6 py-4" dir={dir}>
          <div className={`flex ${dir === "rtl" ? "flex-row-reverse" : ""} items-center justify-between text-sm text-primary-foreground/80`}>
            <p className="font-open-sans">{t("common.footer.copyright")}</p>
            <p className="font-open-sans">{t("common.footer.version")}</p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-primary border-t border-primary/20 mt-auto">
      <div className="container mx-auto px-6 py-8" dir={dir}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-montserrat font-semibold text-primary-foreground mb-3 text-lg">
              {t("common.appName")}
            </h3>
            <p className="text-primary-foreground/80 font-open-sans text-sm mb-4">
              {t("common.appSubtitle")}
            </p>
            <p className="text-primary-foreground/80 font-open-sans text-xs">
              {t("common.footer.copyright")}
            </p>
          </div>

          <div>
            <h4 className="font-montserrat font-semibold text-primary-foreground mb-3 text-sm">
              {t("common.footer.links")}
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/80 hover:text-primary-foreground font-open-sans text-sm transition-colors"
                >
                  {t("common.footer.privacyPolicy")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/80 hover:text-primary-foreground font-open-sans text-sm transition-colors"
                >
                  {t("common.footer.termsOfService")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-montserrat font-semibold text-primary-foreground mb-3 text-sm">
              {t("common.footer.support")}
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/80 hover:text-primary-foreground font-open-sans text-sm transition-colors"
                >
                  {t("common.footer.contactSupport")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="mb-4 bg-primary-foreground/20" />

        <div className={`flex ${dir === "rtl" ? "flex-row-reverse" : ""} items-center justify-between text-xs text-primary-foreground/80`}>
          <p className="font-open-sans">{t("common.footer.version")}</p>
          <p className="font-open-sans">
            {t("common.footer.builtWith")} <span className="text-primary-foreground">♥</span> {t("common.footer.inQatar")}
          </p>
        </div>
      </div>
    </footer>
  );
};


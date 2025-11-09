import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/contexts/I18nContext";
import { Phone, Laptop, Network, Shield, HardDrive, Monitor } from "lucide-react";

export default function ServiceCatalog() {
  const navigate = useNavigate();
  const { t } = useI18n();

  const services = [
    {
      id: "desktop-phone",
      title: t("serviceCatalog.desktopPhone.title"),
      description: t("serviceCatalog.desktopPhone.description"),
      icon: Phone,
      available: true,
      route: "/request/phone",
    },
    {
      id: "laptop",
      title: t("serviceCatalog.laptop.title"),
      description: t("serviceCatalog.laptop.description"),
      icon: Laptop,
      available: true,
      route: null,
    },
    {
      id: "network-access",
      title: t("serviceCatalog.networkAccess.title"),
      description: t("serviceCatalog.networkAccess.description"),
      icon: Network,
      available: true,
      route: null,
    },
    {
      id: "security-clearance",
      title: t("serviceCatalog.securityClearance.title"),
      description: t("serviceCatalog.securityClearance.description"),
      icon: Shield,
      available: false,
      route: null,
    },
    {
      id: "storage",
      title: t("serviceCatalog.storage.title"),
      description: t("serviceCatalog.storage.description"),
      icon: HardDrive,
      available: true,
      route: null,
    },
    {
      id: "monitor",
      title: t("serviceCatalog.monitor.title"),
      description: t("serviceCatalog.monitor.description"),
      icon: Monitor,
      available: true,
      route: null,
    },
  ];

  return (
    <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/officer/dashboard")}
            className="mb-4"
          >
            {t("serviceCatalog.backToDashboard")}
          </Button>
          <h2 className="font-montserrat font-bold text-3xl text-primary mb-2">
            {t("serviceCatalog.title")}
          </h2>
          <p className="text-muted-foreground font-open-sans">
            {t("serviceCatalog.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card
                key={service.id}
                className={`p-8 transition-all flex flex-col items-center text-center border-0 ${
                  service.available && service.route
                    ? "hover:shadow-lg cursor-pointer"
                    : service.available
                    ? "opacity-75"
                    : "opacity-60"
                }`}
                onClick={() => service.available && service.route && navigate(service.route)}
              >
                {/* Circular Icon Container */}
                <div className="mb-6 flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-accent border-2 border-primary flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-montserrat font-semibold text-xl text-charcoal mb-3">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground font-open-sans leading-relaxed">
                  {service.description}
                </p>

                {/* Coming Soon Badge - only for unavailable services */}
                {!service.available && (
                  <span className="mt-4 text-xs bg-muted px-3 py-1.5 rounded-full font-open-sans">
                    {t("serviceCatalog.comingSoon")}
                  </span>
                )}
              </Card>
            );
          })}
        </div>
        <div className="text-right pt-[15px]">
          <a href="#" className="text-xl text-primary font-semibold hover:text-primary hover:underline transition-colors duration-300">
            View All
          </a>
        </div>
      </div>
  );
}

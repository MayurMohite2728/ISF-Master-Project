import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/contexts/I18nContext";
import { useUser } from "@/contexts/UserContext";
import emblem from "@/assets/lekhwiya-logo.jpg";

export default function Login() {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useI18n();
  const { login } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Predefined users with roles
  const users = {
    nandini: {
      password: "officer123",
      role: "officer" as const,
      name: "Nandini",
      fullName: "Nandini - Officer/Requester",
      route: "/officer/dashboard"
    },
    inthihas: {
      password: "supervisor123",
      role: "supervisor" as const,
      name: "Inthihas",
      fullName: "Inthihas - Supervisor",
      route: "/supervisor/dashboard"
    },
    jasmine: {
      password: "admin123",
      role: "admin" as const,
      name: "Jasmine",
      fullName: "Jasmine - Service Desk Admin",
      route: "/admin/dashboard"
    },
    rashaad: {
      password: "tech123",
      role: "tech_approver" as const,
      name: "Rashaad",
      fullName: "Rashaad - Technical Approver",
      route: "/tech-approver/dashboard"
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const userKey = username.toLowerCase() as keyof typeof users;
    const user = users[userKey];

    if (!user) {
      setError("Invalid username or password");
      return;
    }

    if (user.password !== password) {
      setError("Invalid username or password");
      return;
    }

    // Successful login
    login(user.name, user.role, user.fullName);
    navigate(user.route);
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 w-full h-full">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <img src={emblem} alt="Lekhwiya" className="h-24 w-24 object-contain mb-4" />
          <h1 className="font-montserrat font-bold text-2xl text-charcoal text-center">
            {t("common.appName")}
          </h1>
          <p className="text-muted-foreground font-open-sans text-sm mt-2 text-center">
            {t("common.appSubtitle")}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive font-open-sans">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="username" className="font-montserrat font-semibold">
              {t("common.username")}
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              placeholder={t("common.enterUsername")}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="font-montserrat font-semibold">
              {t("common.password")}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder={t("common.enterPassword")}
              required
            />
          </div>

          <Button type="submit" className="w-full font-montserrat font-semibold">
            {t("common.signIn")}
          </Button>
        </form>

        <div className="mt-6 p-4 rounded-md bg-muted/30 border border-muted">
         <p
  className="text-xs font-semibold text-muted-foreground mb-2 font-montserrat"
>
  {language === "en" ? "Demo Credentials:" : "بيانات الاعتماد التجريبية:"}
</p>
         <div
      className="space-y-1 text-xs text-muted-foreground font-open-sans"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {language === "en" ? (
        <>
          <p>• <span className="font-semibold">nandini</span> / officer123 (Officer)</p>
          <p>• <span className="font-semibold">inthihas</span> / supervisor123 (Supervisor)</p>
          <p>• <span className="font-semibold">jasmine</span> / admin123 (Admin)</p>
          <p>• <span className="font-semibold">rashaad</span> / tech123 (Tech Approver)</p>
        </>
      ) : (
        <>
          <p>• <span className="font-semibold">نانديني</span> / officer123 (الموظف)</p>
          <p>• <span className="font-semibold">إنتيهـاس</span> / supervisor123 (المشرف)</p>
          <p>• <span className="font-semibold">جاسمين</span> / admin123 (مسؤول النظام)</p>
          <p>• <span className="font-semibold">رشـاد</span> / tech123 (الموافق الفني)</p>
        </>
      )}
    </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground font-open-sans">
            {t("login.agreeToTerms")}{" "}
            <a
              href="#"
              className="text-primary hover:underline font-medium"
              onClick={(e) => {
                e.preventDefault();
                // TODO: Navigate to terms page or open terms modal
              }}
            >
              {t("login.termsOfService")}
            </a>{" "}
            {t("login.and")}{" "}
            <a
              href="#"
              className="text-primary hover:underline font-medium"
              onClick={(e) => {
                e.preventDefault();
                // TODO: Navigate to privacy page or open privacy modal
              }}
            >
              {t("login.privacyPolicy")}
            </a>
          </p>
        </div>

        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={toggleLanguage}
          >
            {language === "en" ? "EN | AR" : "AR | EN"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

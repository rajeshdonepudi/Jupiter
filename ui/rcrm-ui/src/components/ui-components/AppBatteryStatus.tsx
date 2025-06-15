import BatteryAlertIcon from "@mui/icons-material/BatteryAlert";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import BatteryFullIcon from "@mui/icons-material/BatteryFull";
import Battery20Icon from "@mui/icons-material/Battery20";
import Battery30Icon from "@mui/icons-material/Battery30";
import Battery50Icon from "@mui/icons-material/Battery50";
import Battery60Icon from "@mui/icons-material/Battery60";
import Battery80Icon from "@mui/icons-material/Battery80";
import React, { useEffect, useState } from "react";
import { Tooltip } from "@mui/material";

interface BatteryIconProps {
  percentage: number;
  charging: boolean;
}

export const getBatteryIcon = ({ percentage, charging }: BatteryIconProps) => {
  if (percentage <= 20) return <Battery20Icon />;
  if (percentage <= 30) return <Battery30Icon />;
  if (percentage <= 50) return <Battery50Icon />;
  if (percentage <= 60) return <Battery60Icon />;
  if (percentage <= 80) return <Battery80Icon />;
  if (percentage > 80) return <BatteryFullIcon />;

  // Fallback for undefined percentages or extreme values
  return <BatteryAlertIcon />;
};

export const BatteryIndicator = ({
  percentage,
  charging,
}: BatteryIconProps) => (
  <div>
    {charging ? (
      <Tooltip title={`Charging - ${percentage}%`}>
        <BatteryChargingFullIcon />
      </Tooltip>
    ) : (
      <Tooltip
        title={(charging ? "Charging" : "Not Charging") + `- ${percentage}%`}
      >
        {getBatteryIcon({ percentage, charging })}
      </Tooltip>
    )}
  </div>
);

const BatteryStatus: React.FC = () => {
  const [percentage, setPercentage] = useState<number | null>(null);
  const [charging, setCharging] = useState<boolean>(false);

  useEffect(() => {
    const fetchBatteryStatus = async () => {
      const battery = await (navigator as any).getBattery();
      setPercentage(battery.level * 100);
      setCharging(battery.charging);

      battery.addEventListener("levelchange", () =>
        setPercentage(battery.level * 100)
      );
      battery.addEventListener("chargingchange", () =>
        setCharging(battery.charging)
      );
    };

    if ((navigator as any).getBattery) {
      fetchBatteryStatus();
    } else {
      console.warn("Battery API is not supported in this browser.");
    }
  }, []);

  return percentage ? (
    <BatteryIndicator percentage={percentage} charging={charging} />
  ) : (
    <span> </span>
  );
};

export default BatteryStatus;

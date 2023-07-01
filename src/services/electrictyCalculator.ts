class ElectricityCalculator {
    private referenceIrradiance: number; // Reference irradiance in watts per square meter (W/m²)

    constructor(referenceIrradiance: number) {
        this.referenceIrradiance = referenceIrradiance;
    }

    /**
     * Calculates the orientation factor based on the orientation of the solar panel.
     * @param orientation - Orientation of the solar panel ("NORTH", "EAST", "SOUTH", "WEST").
     * @returns The orientation factor as a decimal value.
     */
    private calculateOrientationFactor(orientation: string): number {
        let orientationFactor = 1.0;

        switch (orientation) {
            case "NORTH":
                orientationFactor = 1.0;
                break;
            case "EAST":
                orientationFactor = 0.9;
                break;
            case "SOUTH":
                orientationFactor = 0.8;
                break;
            case "WEST":
                orientationFactor = 0.7;
                break;
            default:
                break;
        }
        return orientationFactor;
    }

    /**
     * Calculates the inclination factor based on the tilt angle of the solar panel.
     * @param tiltAngle - Tilt angle of the solar panel in degrees.
     * @returns The inclination factor as a decimal value.
     */
    private calculateTiltAngleFactor(tiltAngle: number): number {
        let tiltAngleFactor = 1.0;

        if (tiltAngle >= 0 && tiltAngle <= 45) {
            tiltAngleFactor = 1.0;
        }
        else if (tiltAngle > 45 && tiltAngle <= 60) {
            tiltAngleFactor = 0.9;
        }
        else if (tiltAngle > 60) {
            tiltAngleFactor = 0.8;
        }
        return tiltAngleFactor;
    }

    /**
     * Calculates the electricity generated by solar panels.
     * @param solarIrradiance - Solar irradiance in watts per square meter (W/m²).
     * @param powerPeak - Maximum power output of the solar panel in watts (W).
     * @param orientation - Orientation of the solar panel ("NORTH", "SOUTH", "EAST", "WEST").
     * @param tiltAngle - Tilt angle of the solar panel in degrees.
     * @param areaPerPanel - Area per cell of the solar panel in square meters (m²).
     * @param numPanels - Total numbers of panels being used.
     * @param powerConversionEfficiency - Power conversion efficiency of the solar panel as a decimal value.
     * @returns The electricity generated in kilowatt-hours (kWh).
     */
    public calculateElectricityProduced(
        solarIrradiance: number,
        powerPeak: number,
        orientation: string,
        tiltAngle: number,
        areaPerPanel: number,
        numPanels: number,
        powerConversionEfficiency: number
    ): number {
        const adjustedPowerPeak = powerPeak * powerConversionEfficiency;
        const adjustedSolarIrradiance = adjustedPowerPeak * (solarIrradiance / this.referenceIrradiance);
        const orientationFactor = this.calculateOrientationFactor(orientation);
        const tiltAngleFactor = this.calculateTiltAngleFactor(tiltAngle);
        const totalPanelsArea = numPanels * areaPerPanel;

        const electricityProduced =
            adjustedSolarIrradiance *
            orientationFactor *
            tiltAngleFactor *
            totalPanelsArea;

        return electricityProduced / 1000;
    }

    public calculateTotalElectricity(
        solarIrradianceData: number[],
        powerPeak: number,
        orientation: string,
        tiltAngle: number,
        areaPerPanel: number,
        numPanels: number,
        powerConversionEfficiency: number
    ): number {
        let totalElectricity = 0;

        for (const solarIrradiance of solarIrradianceData) {
            const electricityProduced = this.calculateElectricityProduced(
                solarIrradiance,
                powerPeak,
                orientation,
                tiltAngle,
                areaPerPanel,
                numPanels,
                powerConversionEfficiency
            );
            totalElectricity += electricityProduced;
        }

        return totalElectricity;
    }
}

// "Standard Test Conditions" (STC) 1000 W/m², "Photovoltaic Engineering Reference Cell" (PERC) 800 W/m²
export default new ElectricityCalculator(800);

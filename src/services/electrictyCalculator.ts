class ElectricityCalculator {
    private referenceIrradiance: number;

    constructor(referenceIrradiance: number) {
        this.referenceIrradiance = referenceIrradiance;
    }

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

    private calculateInclinationFactor(inclination: number): number {
        let inclinationFactor = 1.0;

        if (inclination >= 0 && inclination <= 45) {
            inclinationFactor = 1.0;
        }
        else if (inclination > 45 && inclination <= 60) {
            inclinationFactor = 0.9;
        }
        else if (inclination > 60) {
            inclinationFactor = 0.8;
        }

        return inclinationFactor;
    }

    public calculateElectricityProduced(
        solarIrradiance: number,
        powerPeak: number,
        orientation: string,
        tiltAngle: number,
        areaPerCell: number,
        numPanels: number,
        powerConversionEfficiency: number
    ): number {
        const adjustedPowerPeak = powerPeak * (solarIrradiance / this.referenceIrradiance); // Adjust power peak based on solar irradiance
        const orientationFactor = this.calculateOrientationFactor(orientation); // Calculate the orientation factor based on the orientation
        const inclinationFactor = this.calculateInclinationFactor(tiltAngle); // Calculate the inclination factor based on the tilt angle

        const electricityProduced =
            solarIrradiance *
            orientationFactor *
            inclinationFactor *
            areaPerCell *
            numPanels *
            powerConversionEfficiency;

        return electricityProduced;
    }

    public calculateTotalElectricity(
        solarIrradianceData: number[],
        powerPeak: number,
        orientation: string,
        tiltAngle: number,
        areaPerCell: number,
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
                areaPerCell,
                numPanels,
                powerConversionEfficiency
            );
            totalElectricity += electricityProduced;
        }

        return totalElectricity;
    }
}

// "Standard Test Conditions" (STC) 1000 W/m2, "Photovoltaic Engineering Reference Cell" (PERC) 800 W/m2
export default new ElectricityCalculator(800);

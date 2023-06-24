import weather from "./src/services/weather/weather";

async function test() {
    const ids = await weather.getWeatherCollectionIds();
    console.log(ids);
    const date = new Date();
    ids.forEach((id) => {
        try {
            weather.deleteWeatherDateData(id, date);
        }
        catch (error) {
            console.log(error);
        }
    });
}

// test()

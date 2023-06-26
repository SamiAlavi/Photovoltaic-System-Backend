import weather from "../src/services/weather/weather";

async function test() {
    const ids = await weather.getWeatherCollectionIds();
    console.log(ids);
    const date = new Date();

    for (let i = 2; i <= 30; i++) {
        date.setDate(date.getDate() - i);
        for (let id of ids) {

            try {
                await weather.deleteWeatherDateData(id, date);
            }
            catch (error) {
                console.log(error);
            }
        }

    }
}

test();

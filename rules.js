export const rules = [
    {
        name: "High Temperature",
        check: (data) => data.temperature > 25
    },
    {
        name: "Low Temperature",
        check: (data) => data.temperature < 20
    },
    {
        name: "High Humidity",
        check: (data) => data.humidity > 60
    },
    {
        name: "Low Humidity",
        check: (data) => data.humidity < 40
    }
  ];
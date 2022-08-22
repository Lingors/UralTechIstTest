import './App.css';
import {useEffect, useState} from "react";

function App() {
    const [ip, setIP] = useState('');
    const [city, setCity] = useState('')
    const [streets, setStreets] = useState([])

    const token = "3147d8ae4aacd8df71062175be76c4e543129ba0";

    const getStreet = () => {
        const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
        const street = document.getElementById('street-choice').value
        if (street !== '') {
            const query = city.toLowerCase() + ' ' + street.toLowerCase()

            const options = {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": "Token " + token
                },
                body: JSON.stringify({query: query})
            };

            fetch(url, options)
                .then(response => response.json())
                .then(result => setStreets(result.suggestions))
                .catch(error => console.log("error", error));
        } else {
            setStreets([])
        }
    }

    function noDigits(event) {
        if ("1234567890".indexOf(event.key) !== -1)
            event.preventDefault();
        if (event.key === 'Enter')
            getStreet()
    }

    useEffect(() => {
        const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/iplocate/address?ip=";
        const options = {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Token " + token
            }
        };

        fetch('https://geolocation-db.com/json/')
            .then(response => response.json())
            .then(result => {
                setIP(result.IPv4)
                fetch(url + result.IPv4, options)
                    .then(response => response.json())
                    .then(result => setCity(result.location.data.city))
                    .catch(error => console.log("error", error));
            })


    }, [])

    return (
        <div className="App">
            <header className="App-header">
                <h1>IP: {ip}</h1>
                <h1>Город: {city}</h1>
                <div>
                    <label htmlFor="street-choice">Введите улицу: </label>
                    <input placeholder="Введите улицу" id="street-choice" name="street-choice" autoComplete={'off'} onKeyPress={noDigits}/>
                </div>
                <select>
                    {streets.map((elem, index) => <option key={index}>{elem.unrestricted_value}</option>)}
                </select>
            </header>
        </div>
    );
}

export default App;

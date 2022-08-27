import './App.css';
import {useEffect, useState} from "react";

function App() {
    const [ip, setIP] = useState('') // инициализируем переменную "ip"
    const [city, setCity] = useState('') // инициализируем переменную "city"
    const [streets, setStreets] = useState([]) // инициализируем переменную "streets"

    const token = "3147d8ae4aacd8df71062175be76c4e543129ba0" // токен для доступа к api dadata

    const getStreets = () => { // функция для получения списка улиц
        const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address" // юрл к api dadata
        const street = document.getElementById('street-choice').value // получаем введенные данные в поле улиц
        if (street !== '') { // если не пусто то начинаем получать список улиц
            const query = city.toLowerCase() + ' ' + street.toLowerCase() // создадим строку для api

            const options = { // опции которые передаются к api dadata, включают метод, хедерс и тело запроса
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": "Token " + token
                },
                body: JSON.stringify({query: query})
            }

            fetch(url, options)// делаем запрос к api
                .then(response => response.json()) // преобразуем ответ в json
                .then(result => setStreets(result.suggestions)) // инициализируем переменную "streets" полученный список
                .catch(error => console.log("error", error)) // если ошибка выводим ее в консоль
        } else {
            setStreets([]) // если поле input пустое, то инициализируем переменную "streets" пустым массивом
        }
    }

    function noDigits(event) { // функция для проверки вводимых заначений в поле input, а также проверка не нажатали кнопка Enter
        if (event.key.match(/[^a-zA-Zа-яА-Я]/g)) // если введены любые символы кроме букв, поле инпут не будет изменяться
            event.preventDefault()
        if (event.key === 'Enter') // если нажата кнопка Enter - запускаем функцию для получения списка улиц
            getStreets()
    }

    useEffect(() => { // react hook срабатывающей сразу после рендера компонента
        const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/iplocate/address?ip=" // юрл к api dadata

        const options = { // опции которые передаются к api dadata, включают метод и хедерс
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Token " + token
            }
        }

        fetch('https://geolocation-db.com/json/') // делаем запрос для получения ip
            .then(response => response.json()) // преобразуем ответ в json
            .then(result => {
                setIP(result.IPv4) // инициализируем переменную "ip" полученным ip
                fetch(url + result.IPv4, options) // делаем запрос к api dadata с полученным ip
                    .then(response => response.json()) // преобразуем ответ в json
                    .then(result => setCity(result.location.data.city)) // инициализируем переменную "city" полученным городом
                    .catch(error => console.log("error", error)); // если ошибка, выводим ее в консоль
            })


    }, [])

    return (
        <div className="App">
            <header className="App-header">
                <h1>IP: {ip}</h1> {/*  поле для ip  */}
                <h1>Город: {city}</h1> {/*  поле для города  */}
                <div>
                    <label htmlFor="street-choice">Введите улицу: </label>
                    <input placeholder="Введите улицу" id="street-choice" name="street-choice" autoComplete={'off'}
                           onKeyPress={noDigits}/> {/*  поле для ввода улицы  */}
                </div>
                <select>
                    {streets.map((elem, index) => <option
                        key={index}>{elem.unrestricted_value}</option>)} {/*  пробегаем по массиву улиц и рендерим их внутри селекта  */}
                </select>
            </header>
        </div>
    );
}

export default App;

const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Hello Express!');
});

app.get('/burgers', (req, res) => {
    res.send('We have juicy cheese burgers!');
});

app.get('/pizza/pepperoni', (req, res) => {
    res.send('Your pizza is on the way!');
});

app.get('/pizza/pineapple', (req, res) => {
    res.send("We don't serve that here. Never call again!");
});

app.get('/echo', (req, res) => {
    const responseText = `Here are some details of your request:
    Base URL: ${req.baseUrl}
    Host: ${req.hostname}
    Path: ${req.path}
    `;
    res.send(responseText);
});

app.get('/queryViewer', (req, res) => {
    console.log(req.query);
    res.end();
});

app.get('/sum', (req, res) => {
    //1. get values from the request
    const a = req.query.a;
    const b = req.query.b;

    const aParsed = parseInt(a);
    const bParsed = parseInt(b);

    const c = aParsed + bParsed;

    //2. validate the values
    if (!a) {
        //3. a was not provided
        return res.status(400).send('Please provide an "a" value');
    }
    if (!b) {
        //3. b was not provided
        return res.status(400).send('Please provide a "b" value');
    }

    //4. and 5. both a and b are valid so do the processing
    const answer = `The sum of ${a} and ${b} is ${c}`;

    //6. send the response
    res.send(answer);
});

app.get('/cipher', (req, res) => {
    const text = req.query.text.toUpperCase();
    const shift = req.query.shift;

    const shiftParsed = parseInt(shift);
    //const textCap = toUpperCase(text);

    if (!text) {
        return res.status(400).send('Please provide a text value');
    }
    if (!shift) {
        return res.status(400).send('Please provide a number for the shift value');
    }

    const resCipher = `${text.replace(/[A-Z]/g, thisCanBeAnything => String.fromCharCode((thisCanBeAnything.charCodeAt(0) - 65 + shiftParsed) % 26 + 65))}`;

    res.send(resCipher);
})

app.get('/lotto', (req, res) => {
    const { numbers } = req.query;

    if(!numbers) {
        return res.status(400).send("numbers is required");
    };
    if(!Array.isArray(numbers)) {
        return res.status(400).send("numbers must be an array");
    };

    const queryNumbers = numbers
        .map(n => parseInt(n))
        .filter(n => !Number.isNaN(n) && (n >= 1 && n <= 20));

    if (queryNumbers.length != 6) {
        return res
            .status(400)
            .send("numbers must contain 6 integers between 1 and 20");
    };

    const stockNumbers = Array(20).fill(1).map((_, i) => i + 1);
    const randomNumbersArr = [];
    for (let i = 0; i < 6; i++) {
        const generated = Math.floor(Math.random() * stockNumbers.length);
        randomNumbersArr.push(stockNumbers[generated]);
        stockNumbers.splice(generated, 1);
    };

    let compare = randomNumbersArr.filter(n => !queryNumbers.includes(n));

    let feedbackString;

    switch (compare.length) {
        case 0:
            feedbackString = 'Wow! Unbelievable! You could have won the mega millions!';
            break;
        case 1:
            feedbackString = 'Congratulations! You win $100!';
            break;
            default:
                feedbackString = 'Sorry, you lose';
    }

    res.send(feedbackString);


})

app.listen(8000, () => {
    console.log('Express server is listening on port 8000!');
});
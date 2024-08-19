import {useState} from 'react';

export const useTheme = () => {
    const [theme, setTheme] = useState('light');
    const [textColor, setTextColor] = useState('black');
    const [backgroundColor, setBackgroundColor] = useState('white');
    const [viewColor, setViewColor] = useState('white');
    const [subViewColor, setSubViewColor] = useState('white');
    const [buttonColor, setButtonColor] = useState('blue');
    const [buttonTextColor, setButtonTextColor] = useState('white');

    const SetDarkTheme =()=> {
        setTheme('dark');
        setTextColor('white');
        setBackgroundColor('#575757');
        setViewColor('#383838');
        setSubViewColor('#575757');
        setButtonColor('#282828');
        setButtonTextColor('white');
    };
    const SetLightTheme = () => {
        setTheme('light');
        setTextColor('black');
        setBackgroundColor('white');
        setViewColor('white');
        setSubViewColor('white');
        setButtonColor('blue');
        setButtonTextColor('white');
    };

    return [theme, textColor, backgroundColor, viewColor, subViewColor, buttonColor, buttonTextColor, SetDarkTheme, SetLightTheme];
};

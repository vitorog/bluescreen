import "./flipclock.css";
import React from "react";

// function component
const AnimatedCard = ({ animation, digit }) => {
    return(
        <div className={`flipCard ${animation}`}>
        <span>{digit}</span>
        </div>
    );
};
  
// function component
const StaticCard = ({ position, digit }) => {
    return(
        <div className={position}>
        <span>{digit}</span>
        </div>
    );
};
  
  // function component
const FlipUnitContainer = ({ digit, shuffle, unit }) => {	

    // assign digit values
    let currentDigit = digit;
    let previousDigit = digit - 1;

    // to prevent a negative value
    if ( unit == 'seconds' || unit == 'minutes') {
        previousDigit = previousDigit === -1 
        ? 59 
        : previousDigit;
    } else if (unit == 'hours') {
        previousDigit = previousDigit === -1 
        ? 23 
        : previousDigit;
    } else if (unit == 'days') {
        previousDigit = previousDigit === -1 
        ? 364
        : previousDigit;
    }

    // add zero
    let currentDigitString = (currentDigit < 10) ? `0${currentDigit}` : `${currentDigit}`;
    let previousDigitString = (previousDigit < 10) ? `0${previousDigit}` : `${previousDigit}`;


    // shuffle digits
    const digit1 = shuffle 
        ? previousDigitString 
        : currentDigitString;
    const digit2 = !shuffle 
        ? previousDigitString 
        : currentDigitString;

    // shuffle animations
    const animation1 = shuffle 
        ? 'fold' 
        : 'unfold';
    const animation2 = !shuffle 
        ? 'fold' 
        : 'unfold';

    let i18n = {
        days:"Dias",
        hours:"Horas",
        minutes:"Minutos",
        seconds:"Segundos"
    }

    return(        
        <div>
            <p>{i18n[unit]}</p>
            <div className={'flipUnitContainer'}>
                <StaticCard 
                    position={'upperCard'} 
                    digit={currentDigitString} 
                    />
                <StaticCard 
                    position={'lowerCard'} 
                    digit={previousDigitString} 
                    />
                <AnimatedCard 
                    digit={digit1}
                    animation={animation1}
                    />
                <AnimatedCard 
                    digit={digit2}
                    animation={animation2}
                    />
            </div>
        </div>        
    );
};

interface Props {    
    timeDifference: any;
}  
  // class component
export class FlipClock extends React.Component<Props, {}> {
    private timerID;
    public state;

    constructor(props) {
        super(props);
        this.state = {
            days: 0,
            daysShuffle: true,
            hours: 0,
            hoursShuffle: true,
            minutes: 0,
            minutesShuffle: true,
            seconds: 0,
            secondsShuffle: true
        };
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.updateTime(),
            50
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    updateTime() {                
        const days = this.props.timeDifference.days;
        const hours = this.props.timeDifference.hours;
        const minutes = this.props.timeDifference.minutes;
        const seconds = this.props.timeDifference.seconds;

        // on hour chanage, update hours and shuffle state
        if( days !== this.state.days) {
            const daysShuffle = !this.state.daysShuffle;
            this.setState({
                days,
                daysShuffle
            });
        }

        // on hour chanage, update hours and shuffle state
        if( hours !== this.state.hours) {
            const hoursShuffle = !this.state.hoursShuffle;
            this.setState({
                hours,
                hoursShuffle
            });
        }
        // on minute chanage, update minutes and shuffle state
        if( minutes !== this.state.minutes) {
            const minutesShuffle = !this.state.minutesShuffle;
            this.setState({
                minutes,
                minutesShuffle
            });
        }
        // on second chanage, update seconds and shuffle state
        if( seconds !== this.state.seconds) {
            const secondsShuffle = !this.state.secondsShuffle;
            this.setState({
                seconds,
                secondsShuffle
            });
        }
    }

    render() {
        // state object destructuring
        const { 
            days, 
            hours, 
            minutes, 
            seconds, 
            daysShuffle, 
            hoursShuffle, 
            minutesShuffle, 
            secondsShuffle 
        } = this.state;
            
        return(
                <div className={'flipClock'}>
                    <FlipUnitContainer 
                        unit={'days'}
                        digit={days} 
                        shuffle={daysShuffle} 
                        />
                    <FlipUnitContainer 
                        unit={'hours'}
                        digit={hours} 
                        shuffle={hoursShuffle} 
                        />
                    <FlipUnitContainer 
                        unit={'minutes'}
                        digit={minutes} 
                        shuffle={minutesShuffle} 
                        />
                    <FlipUnitContainer 
                        unit={'seconds'}
                        digit={seconds} 
                        shuffle={secondsShuffle} 
                        />
                </div>
            );
    }
}
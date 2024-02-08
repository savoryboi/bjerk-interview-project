import inquirer from 'inquirer';
import fs from 'fs';

// Parse data from raw files and save into variables
const Companies = JSON.parse(fs.readFileSync('./data/Companies.json', 'utf8'));
const Guests = JSON.parse(fs.readFileSync('./data/Guests.json', 'utf8'));
const Templates = JSON.parse(fs.readFileSync('./data/Templates.json', 'utf8'));

// Create object for user's selected message information
let chosenCompany;
let chosenGuest;
let chosenTemplate;

// Gets hours of current time and returns the Time Of Day (morning, afternoon, evening) for use in messages 
const getTimeOfDay = () => {
    const time = new Date().getHours();

    if (time < 12) {
        return "morning";
    } else if (time > 17) {
        return "evening";
    } else {
        return "afternoon";
    }
};

// user selects the company to send message from
const getCompany = () => {
    // simplifying hotel objects to their names for readability
    const hotelNames = Companies.map(hotel => hotel.company);

    inquirer
        .prompt({
            type: 'list',
            name: "hotel",
            message: 'Please select your company',
            choices: hotelNames
        })
        .then(answer => {
            // find mattching company object by its company property
            Companies.forEach(hotel => {
                if (hotel.company === answer.hotel) {
                    chosenCompany = hotel;
                }
            });
            // proceed to next prompt
            return getGuest();
        })

}

// user selects guest to send message to
const getGuest = () => {
    const guestChoices = Guests.map(guest => `Room #${guest.reservation.roomNumber}: ${guest.firstName} ${guest.lastName}`);

    inquirer.prompt({
        type: 'list',
        name: "guest",
        message: 'Which guest would you like to send a message?',
        choices: guestChoices
    })
        .then(answer => {
            // split readable prompt to array of first and last name
            const guestNameArray = answer.guest.split(': ')[1].split(' ');

            // iterate thought array of Guests, to match name chosen to a guest's ID and save to chosenGuest
            Guests.forEach(guest => {
                if (guest.firstName === guestNameArray[0] && guest.lastName === guestNameArray[1]) {
                    chosenGuest = guest;
                }
            })
            // proceed to next step
            return getTemplate()
        })

}

// user selects template, or chooses to write their own
const getTemplate = () => {
    inquirer.prompt({
        type: 'list',
        message: 'Use existing message template or Write your own?',
        choices: ['Existing', 'Write'],
        name: 'template'
    })
        .then(answer => {
            if (answer.template === 'Existing') {
                return inquirer.prompt({
                    type: 'list',
                    name: 'template',
                    message: 'Which template would you like to use?',
                    choices: ['Welcome', 'Farewell', 'Just checking in']
                })

                    .then(answer => {
                        if (answer.template === 'Welcome') {
                            chosenTemplate = Templates.welcome;
                        } else if (answer.template === 'Farewell') {
                            chosenTemplate = Templates.farewell;
                        } else {
                            chosenTemplate = Templates.check_in;
                        };

                        return assembleMessage(chosenCompany, chosenGuest, chosenTemplate);
                    })
            }

            else if (answer.template === 'Write') {
                writeNewMessage(chosenCompany, chosenGuest)
            }
        })

};

// Prompt user with input for their custom message and the placeholders to use in place of guest/company data
const writeNewMessage = (hotel, guest) => {
    inquirer.prompt({
        type: 'input',
        message: 'What would you like your message to say? \n\n *** PLACEHOLDERS TO USE WHERE NECESSARY *** \n\n ${timeOfDay} \n ${companyName} \n ${firstName}\n ${lastName}\n ${roomNumber} \n ${cityName} \n\n My messssage: ',
        name: 'new_message'
    })
    .then(answer => {
        const message = answer.new_message;

        // checks for lack of placeholder/varables 
        if(!message.includes('${timeOfDay}') && 
            !message.includes('${companyName}') && 
            !message.includes('${firstName}') && 
            !message.includes('${lastName}') && 
            !message.includes('${roomNumber}') &&
            !message.includes('${cityName}')) 
            {
            inquirer.prompt({
                type: 'list',
                message: `\nLooks like none of the placeholders were used, or there was a typo. \n\nHere\'s what you wrote: \n ${answer.new_message} \n\n Are you sure you want to send it?\n`,
                name: 'toProceed',
                choices: ['Send it', 'Re-write this message', 'Start Over']
            })
            .then(answer => {
                if(answer.toProceed === 'Start Over') return getCompany();
                else if(answer.toProceed === 'Re-write this message') return writeNewMessage(hotel, guest);
                else return assembleMessage(hotel, guest, message)
            })

        } else {
            // Variables present and correctly spelled... Proceed to assembly of message into a template literal
            return assembleMessage(hotel, guest, message)
        }
    })
}

// take template, hotel and guest info and converts from a string to a template literal to create final message
const assembleMessage = (hotel, guest, template) => {

    const timeOfDay = getTimeOfDay();
    const companyName = hotel.company;
    const firstName = guest.firstName;
    const lastName = guest.lastName;
    const roomNumber = guest.reservation.roomNumber;
    const cityName = hotel.city;

    // Convert a string into a template literal so values can be easily injected into message
    const finalMessage = eval(`\`${template}\``);
    
    // proceed to next step
    return sendFinalMessage(finalMessage, firstName, lastName, roomNumber, companyName);
};

// check for final confirmation of message and information
const sendFinalMessage = (message, first, last, room, hotel) => {

    inquirer.prompt({
        type: 'confirm',
        message: `\nYour message to ${first} ${last} in room #${room} from ${hotel}: \n   ${message} \n \nReady to send it?`,
        name: 'ready'
    })
    .then(answer => {
        if(answer.ready){
            // HERE IS WHERE YOU WOULD PUT THE CODE TO SEND A REAL MESSAGE IF THIS WAS FOR REAL
            return nextGuest();
        } else {
            return getTemplate()
        }
    });
    
};

// either send a new message or end progran
const nextGuest = () => {
    inquirer.prompt({
        type: 'confirm',
        name: 'next',
        message: 'Send another message?'
    })
    .then(answer => {
        if(answer.next){
            return getCompany();
        } else {
            console.log('See you next time! Thanks for using my program... It was very fun to make.')
        }
    })
}

// start application
getCompany();
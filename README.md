
# Instructions for how to run this program
* Download and unzip the directory 
* Open the folder in your text editor
* Open your terminal for the `bjerk-interview-project` directory
* Install packages using the command `npm install`
* run command `node index.js`

# User Story
```
AS A USER I want to send a message to a guest/customer from a default or custom template.
WHEN I start the application
THEN I am prompted for my company information.
WHEN I select the company to send a message from
THEN I am prompted to select a guest to send a message to.
WHEN I select a guest
THEN I am asked if I want to use an existing template or write my own.
WHEN I choose an existing tmeplate
THEN I am prompted to select a template.
WHEN I choose to write my own
THEN I am prompted to input a messsage using given placeholders for any data I might want to use.
WHEN my template has been selected or written
THEN I review it and either send it, edit it, or start from the beginning.
WHEN my message has been sent
THEN I can either end the program or send another message.
```

# An overview of design decisions
To create this program, I decided to use inquirer.js for a command line application. I considered using React, and going full front-end developer, but in the essence of time and eagerness to get this project done ASAP, I decided not to allow myself the temptation of geting way too lost in the UI design. 

In order to effectively store the answers received from user interacion, the program initializes the variables: `chosenCompany, chosenGuest, chosenTemplate` in the global scope, so that they can be accessed throughout the program. Each prompt lives in its own specific function `getCompany, getGuest, getTemplate` so that backtracking, starting over, or moving onward to the next step is clean and easy. 

The biggest challenges I had in this program were:
    * Converting the strings from the `Templates.json` file into template literals that could actually have the values inserted into the string.
    * Designing an error catching mechanism to check for new custom templates' inclusion/exclusion of the necessary placeholder values, and any accidental typos not caught by the user. 


# What language you picked and why
I chose to work in Node.js for its readability and my comfortability level with it. I'd worked with inquirer.js a couple times before, and knew that it would work for what I was trying to accopmlish. 

# Your process for verifying the correctness of you program
I went through the user process and tried every option to ensure that no errors were thrown, and that the program made sense to the user. There are multiple places in the prompts that presents the message, guest, and company data for the user to verify that everything is correct.

When working on the inital setup and design of this program, I had `console.log()` at almost every step to make sure I was getting all the correct information. 

# What didn't you get to, or what else might you do with more time?
I would have loved to make this in React, actually. I think there's a lot of potential for a GUI, especially when it comes to a user writing their own message template -- I know I probably could've found a more user-friendly way than to have them manually write `Welcome to ${cityName}, ${firstName}!` etc. It would be awesome to have a drag-and-drop UI where all the company, time of day, and guest data can be placed into a custom message template. 


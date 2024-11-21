const mongoose = require ('mongoose')

async function connect() {
    try {
        await mongoose.connect('mongodb+srv://root:<db_password>@cluster0.ink1l.mongodb.net/HealthBookingWebsite_dev?retryWrites=true&w=majority&appName=Cluster0')
        console.log('Connected!');
    }catch (error) {
        console.log('Fail Connected');
    }
}

module.exports = { connect };

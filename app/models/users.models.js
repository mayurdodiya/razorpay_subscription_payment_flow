// import { v4 as uuidv4 } from 'uuid';
module.exports = (sequelize, Sequelize) => {

    const Users = sequelize.define('user',
        {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
                primaryKey: true
              },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING,
            },
            image_url: {
                type: Sequelize.STRING,
            },
            latitude: {
                type: Sequelize.FLOAT,
            },
            longitude: {
                type: Sequelize.FLOAT,
            },
        });
    return Users
}
// give quey logic in sequelize qith mysql that all user which are near 2km me as per geographicaly from my latitude longitude data 

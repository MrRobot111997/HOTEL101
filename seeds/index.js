const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Hotel = require("../models/hotel");

mongoose.connect("mongodb://localhost:27017/hotel101", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Hotel.deleteMany({});
  for (let i = 0; i < 45; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const randomLocation = `${cities[random1000].city}, ${cities[random1000].state}`;

    const hotel = new Hotel({
      //YOUR USER ID
      author: "60e2d539f89c9c2fc88c8af3",
      location: randomLocation,
      title: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url: "https://res.cloudinary.com/dhbkhmq8a/image/upload/v1622981314/Hotel101/four-seasons-hotel-lion-palace-st-petersburg-200004-1_myuqnw.jpg",
          filename:
            "Hotel101/four-seasons-hotel-lion-palace-st-petersburg-200004-1_myuqnw",
        },
        {
          url: "https://res.cloudinary.com/dhbkhmq8a/image/upload/v1622981314/Hotel101/pool-for-google-blog_cmrpgu.jpg",
          filename: "Hotel101/pool-for-google-blog_cmrpgu",
        },
      ],
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque unde perspiciatis quo aliquid illum minima ipsa animi a velit officiis nulla quia, blanditiis vero dicta nam eveniet. Quasi, quod fuga.",
      price: price,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      // description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
      // price,
      // geometry: {
      //     type: "Point",
      //     coordinates: [
      //         cities[random1000].longitude,
      //         cities[random1000].latitude,
      //     ]
      // },
    });

    await hotel.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});

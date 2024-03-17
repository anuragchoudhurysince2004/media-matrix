const db = require("./../utils/dbclient");
const websites = [
  { name: "Sports", url: "https://indianexpress.com/section/sports/" },
  {
    name: "Political Pulse",
    url: "https://indianexpress.com/section/political-pulse/",
  },
  {
    name: "Lifestyle",
    url: "https://indianexpress.com/section/lifestyle/",
  },
  {
    name: "Entertainment",
    url: "https://indianexpress.com/section/entertainment/",
  },
  { name: "Business", url: "https://indianexpress.com/section/business/" },
  { name: "India", url: "https://indianexpress.com/section/india/" },
];
exports.getOverview = async (req, res) => {
  try {
    res;
    await db.client.connect();
    const database = db.client.db("MM");
    const collection = database.collection("news");
    const articles = await collection.find({}).toArray();
    res.status(200).render("index.pug", {
      articles: articles,
      websites,
    });

    //we would need to await the query for getting news from the database
  } catch (err) {
    res.status(500).json({
      status: "error",
      err: err.message,
      err,
    });
  }
};

exports.getLoginForm = async (req, res) => {
  try {
    await res.status(200).render("login.pug");
  } catch (err) {
    //the catch block is not working currently
    res.status(500).send("something went very wrong");
  }
};

exports.showProfile = async (req, res) => {
  try {
    console.log(req.user);
    await db.client.connect();
    const database = db.client.db("MM");
    const collection = database.collection("news");
    let positiveNews;
    let negativeNews;

    //adding the if-else only for if the user is admin then he could be able to see all the news in the databse marked as positive and negative
    if (req.user.department === "admin") {
      positiveNews = await collection.find({ sentiment: "1" }).toArray();
      neutralNews = await collection.find({ sentiment: "0" }).toArray();

      negativeNews = await collection.find({ sentiment: "-1" }).toArray();
    } else {
      positiveNews = await collection.find({ sentiment: 1 }).toArray();
      neutralNews = await collection.find({ sentiment: 0 }).toArray();

      negativeNews = await collection.find({ sentiment: -1 }).toArray();
    }
    // } else {
    //   positiveNews = await collection
    //     .find({ sentiment: 1, department: req.user.department })
    //     .toArray();
    //   neutralNews = await collection
    //     .find({ sentiment: 0, department: req.user.department })
    //     .toArray();

    //   negativeNews = await collection
    //     .find({ sentiment: -1, department: req.user.department })
    //     .toArray();
    // }
    await res.status(200).render("profile.pug", {
      websites,
      positiveNews,
      neutralNews,
      negativeNews,
    });
  } catch (err) {
    //the catch block is not working currently
    res.status(500).send("something went very wrong");
    console.log(err);
  }
};

// exports.getPibMainFunctions=async (req,res)=>{
//     try{
//         await res.status(200).render('pib-main-function')
//     }catch(err){
//         res.status(500).send("something went very wrong!!")
//     }
// }
exports.getPibMainFunctions = async (req, res) => {
  try {
    await res.status(200).render("pib-main-function");
  } catch (err) {
    res.status(500).send("something went very wrong!!");
  }
};
exports.getPibOrganizationalSetup = async (req, res) => {
  try {
    await res.status(200).render("pib-organizational-setup");
  } catch (err) {
    res.status(500).send("something went very wrong!!");
  }
};

exports.getAboutPibMediaAnal = async (req, res) => {
  try {
    await res.status(200).render("about-pib-media-analyzer");
  } catch (err) {
    res.status(404).send("404:Page not found");
  }
};

exports.showRegisterForm = async (req, res) => {
  try {
    await res.status(200).render("register.pug");
  } catch (err) {
    res.status(500).send("something went very wrong");
  }
};

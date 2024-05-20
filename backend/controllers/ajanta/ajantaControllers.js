const {ajantaFinalData, ajantaInsightsData} = require('../../model/ajanta/ajantaModel')

async function getAllData(req, res)
{
    const reviewRating = await ajantaFinalData.aggregate([{$group: {_id: null, totalreviews: {$sum: "$totalReviewCount"}, averagerating: {$sum: "$averageRating"}}}]);
    const analysis = await ajantaInsightsData.aggregate([{$group: {_id: null, "Google Search Mobile": {$sum: "$Google Search - Mobile"}, "Google Search Desktop": {$sum: "$Google Search - Desktop"}, "Google Maps Mobile": {$sum: "$Google Maps - Mobile"}, "Google Maps Desktop": {$sum: "$Google Maps - Desktop"}, "Calls": {$sum: "$Calls"}, "Directions": {$sum: "$Directions"}, "Websit Clicks": {$sum: "$Website clicks"}}}]);
    const graphDataCalls = await ajantaInsightsData.aggregate([
    {
      $group: {
        _id: "$Month", 
        totalCalls: { $sum: "$Calls" }
      }
    },
    {
      $group: {
        _id: null,
        monthlyData: {
          $push: {
            k: "$_id",
            v: "$totalCalls"
          }
        }
      }
    },
    {
      $replaceRoot: {
        newRoot: { $arrayToObject: "$monthlyData" }
      }
    }
  ])
    const graphDataSearchesMobils = await ajantaInsightsData.aggregate([
    {
      $group: {
        _id: "$Month",
        totalGoogleSearchMobile: { $sum: "$Google Search - Mobile" }
      }
    },
    {
      $group: {
        _id: null,
        monthlyData: {
          $push: {
            k: "$_id", // Month
            v: "$totalGoogleSearchMobile" // Total Google Search - Mobile for the month
          }
        }
      }
    },
    {
      $replaceRoot: {
        newRoot: { $arrayToObject: "$monthlyData" }
      }
    }
  ])
    const graphDataSearchesDesktops = await ajantaInsightsData.aggregate([
    {
      $group: {
        _id: "$Month",
        totalGoogleSearchDesktop: { $sum: "$Google Search - Desktop" }
      }
    },
    {
      $group: {
        _id: null,
        monthlyData: {
          $push: {
            k: "$_id", // Month
            v: "$totalGoogleSearchDesktop" // Total Google Search - Desktop for the month
          }
        }
      }
    },
    {
      $replaceRoot: {
        newRoot: { $arrayToObject: "$monthlyData" }
      }
    }
  ])
    analysis[0].Searches = analysis[0]['Google Search Mobile'] + analysis[0]['Google Search Desktop']
    const graphDataSearches = 
        [{
            "Feb": graphDataSearchesMobils[0].Feb + graphDataSearchesDesktops[0].Feb,
            "Mar": graphDataSearchesMobils[0].Mar + graphDataSearchesDesktops[0].Mar,
            "Apr": graphDataSearchesMobils[0].Apr + graphDataSearchesDesktops[0].Apr
        }]
    return res.status(200).json({reviewRating, analysis, graphDataCalls, graphDataSearches})
}   

async function getTopFiveDoctors(req, res)
{
  const getTopFivedocs = await ajantaInsightsData.aggregate([
      {
        $group: {
          _id: "$Business name",
          totalSearches: { $sum: { $add: ["$Google Search - Mobile", "$Google Search - Desktop"] } }
        }
      },
      {
        $sort: { totalSearches: -1 }
      },
      {
        $limit: 5
      }
    ]);
  return res.status(200).json(getTopFivedocs)  
}

async function getAllDoctorNames(req, res)
{
  const allDoctors = await ajantaFinalData.distinct("business_name")
  return res.status(200).json(allDoctors)
}

async function getDocData(req, res)
{
  const requestData = req.body.businessName;
  const result = []
  const docData = await ajantaInsightsData.aggregate([
    {
      $match: {
        "Business name": requestData
      }
    },
    {
      $group: {
        _id: "$Month",
        "Google Search - Mobile": { $push: "$Google Search - Mobile" },
        "Google Search - Desktop": { $push: "$Google Search - Desktop" },
        "Google Maps - Mobile": { $push: "$Google Maps - Mobile" },
        "Google Maps - Desktop": { $push: "$Google Maps - Desktop" },
        "Website clicks": { $push: "$Website clicks" },
        "Directions": { $push: "$Directions" },
        "Calls": { $push: "$Calls" }
      }
    },
    {
      $project: {
        data: {
          $arrayToObject: [
            [
              {
                k: "$_id",
                v: { $concatArrays: ["$Google Search - Mobile", "$Google Search - Desktop", "$Google Maps - Mobile", "$Google Maps - Desktop", "$Website clicks", "$Directions", "$Calls"] }
              }
            ]
          ]
        }
      }
    }
  ])

  const labels = await ajantaFinalData.aggregate([
    {
      $match: {
        "business_name": requestData
      }
    },
   {
        $group: {
          _id: "business_name",
          "Labels": { $push: "$labels" },
          "ss": {$push: "$profile_screenshot"}
        }
      },
  ] )
  
  const mapsGraph = await ajantaInsightsData.aggregate([
  {
      $match: { "Business name": requestData } // Specify the business name here
  },
    {
      $group: {
        _id: "$Month",
        totalSearches: {
          $sum: {
            $add: ["$Google Maps - Desktop", "$Google Maps - Mobile"]
          }
        }
      }
    },
    {
      $group: {
        _id: null,
        data: {
          $push: {
            k: "$_id",
            v: "$totalSearches"
          }
        }
      }
    },
    {
      $replaceRoot: {
        newRoot: { $arrayToObject: "$data" }
      }
    }
  ])
  const actionGraph = await ajantaInsightsData.aggregate([
  {
      $match: { "Business name": requestData } // Specify the business name here
  },
    {
      $group: {
        _id: "$Month",
        totalSearches: {
          $sum: {
            $add: ["$Website clicks", "$Directions", "$Calls"]
          }
        }
      }
    },
    {
      $group: {
        _id: null,
        data: {
          $push: {
            k: "$_id",
            v: "$totalSearches"
          }
        }
      }
    },
    {
      $replaceRoot: {
        newRoot: { $arrayToObject: "$data" }
      }
    }
  ])
  const searchesGraph = await ajantaInsightsData.aggregate([
  {
    $match: { "Business name": requestData } // Specify the business name here
  },
  {
    $group: {
      _id: "$Month",
      totalSearches: {
        $sum: {
          $add: ["$Google Search - Desktop", "$Google Search - Mobile"]
        }
      }
    }
  },
  {
    $group: {
      _id: null,
      data: {
        $push: {
          k: "$_id",
          v: "$totalSearches"
        }
      }
    }
  },
  {
    $replaceRoot: {
      newRoot: { $arrayToObject: "$data" }
    }
  }
])

  if(docData && labels)
  {
    // return res.json(labels)
    const competitor = labels[0].Labels[0][0].competitors
    const keywordsRanking = []
    const cRank = []
    const images = {
      lable1: "https://staging.multipliersolutions.com/gmbnewprofiles/Ajanta/lables/" + labels[ 0 ].Labels[ 0 ][ 0 ].screen_shot + ".png",
      lable2: "https://staging.multipliersolutions.com/gmbnewprofiles/Ajanta/lables/" + labels[ 0 ].Labels[ 0 ][ 1 ].screen_shot + ".png",
      profile: "https://staging.multipliersolutions.com/gmbnewprofiles/Ajanta/profiles/" + labels[ 0 ].ss
    }

    labels[0].Labels[0].map((item, i) => {
      keywordsRanking[i] = []
      keywordsRanking[i].push(item.label)
      keywordsRanking[i].push(item.rank)
    })

    competitor.map((item, i) => {
      if(i + 1 > 10)
      {
        return;
      }
      else {
        cRank[i] = []
        cRank[i].push(item)
        cRank[i].push(i + 1)
      }
    } )
    


    docData.map((item, i) => {
      result[i] = [];
      let temp = item._id;
      result[i].push(temp);
      item.data[temp].map((counts) => {
        result[i].push(counts);
      })
    } )
    const accountID = await ajantaFinalData.aggregate([
      { $match: { business_name: requestData } },
      { $project: { _id: 0, account: 1 } },
      { $group: { _id: null, accounts: { $push: "$account" } } },
      { $project: { _id: 0, accounts: 1 } }
    ])
    const account = accountID[ 0 ].accounts[ 0 ]
    console.log(account)
    const ratings = []
    const goodreviews = []
    const badreviews = []
    ratings[0] = 0
    ratings[1] = 0
    ratings[2] = 0
    ratings[3] = 0
    ratings[4] = 0
    if ( accountID )
    {
      async function rrHandeler(token)
      {
        console.log("inside function=========")
        const fetch = (await import('node-fetch')).default;

        const response = await fetch("https://multipliersolutions.in/gmbhospitals/gmb_api/api.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "function": "reviews",
                "email": "ajantagmbaccess@gmail.com",
                "location": account,
                "pageToken": token
            })
        });

        const responseText = await response.text(); 
        const review = JSON.parse( responseText )
        console.log( "review: ", review )
        if ( review.totalReviewCount != null )
        {
          for(let i = 0; i < review.reviews.length; i++)    
          {
            console.log(review.reviews[i].comment)
            if(review.reviews[i].comment !== "null")
            {
                if(goodreviews.length !== 5 && review.reviews[i].starRating === "FIVE")
                {
                    goodreviews.push([goodreviews.length + 1, review.reviews[i].comment])
                }
                if(badreviews.length !== 5 && review.reviews[i].starRating === "ONE")
                {
                    badreviews.push([badreviews.length + 1, review.reviews[i].comment])
                }
            }
            if(review.reviews[i].starRating === "ONE")
            {
                console.log("1")
                ratings[0] += 1
            }
            if(review.reviews[i].starRating === "TWO")
            {
                ratings[1] += 1
            }
            if(review.reviews[i].starRating === "THREE")
            {
                ratings[2] += 1
            }
            if(review.reviews[i].starRating === "FOUR")
            {
                ratings[3] += 1
            }
            if(review.reviews[i].starRating === "FIVE")
            {
                console.log("5")
                ratings[4] += 1
            }
          }
          if(review.nextPageToken)
          {
              rrHandeler(review.nextPageToken)
          }
        }
        await rrHandeler("")
      }

    }
    return res.status(200).json({result, cRank, keywordsRanking, searchesGraph, mapsGraph, images, actionGraph, ratings, goodreviews, badreviews})
  }
  return res.status(401).json({"msg": "Data Not Found"});
}

module.exports = {
  getAllData,
  getTopFiveDoctors,
  getDocData,
  getAllDoctorNames
}

// "Dr Vishal Chugh(Radiant Skin Clinic) Best Dermatologist in Jaipur Skin Specialist, Hair Loss Treatment, PRP Therapy in Jaipur"
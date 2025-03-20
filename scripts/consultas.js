db.restaurants.find({
    "type_of_food": "Chinese"
})

db.inspections.find({ "result": { $ne: "No Violation Issued" } }).sort({ "date": 1 })


db.restaurants.find({ 
"rating": { $gt: 4 } })


db.restaurants.aggregate([
    {
      $group: {
        _id: "$type_of_food",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 } 
      }
    },
    {
      $sort: { avgRating: -1 }   }
  ])

  

  db.inspections.aggregate([
    {
      $group: {
        _id: "$result",
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$count" },
        results: { $push: { result: "$_id", count: "$count" } }
      }
    },
    { $unwind: "$results" },
    {
      $project: {
        _id: 0,
        result: "$results.result",
        count: "$results.count",
        percentage: {
          $multiply: [
            { $divide: ["$results.count", "$total"] },
            100
          ]
        }
      }
    }
  ])

  

  db.restaurants.aggregate([
    {
      $addFields: {
        id_string: { $toString: "$_id" }
      }
    },
    {
      $lookup: {
        from: "inspections",
        localField: "id_string",
        foreignField: "restaurant_id",
        as: "inspections"
      }
    },
    {
      $project: {
        id_string: 0
      }
    },
    { $limit: 5 }
  ])
  

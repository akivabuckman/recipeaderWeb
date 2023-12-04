
import OpenAIApi from "openai";

const algorithm = async (props) => {
    // get recipe input
    if (props.recipeInput.length > 0) {
        try {
            const sentence = `Convert the following recipe description into the specified JSON object format:

            {
                "ingredients": [
                    {
                        "food": "<food - do not include quantities>",
                        "quantity": {
                            "amount": <amount>,
                            "unit": "<unit>"
                        }
                    }
                ],
                "yield": {
                    "quantity": <yield quantity>,
                    "units": "<yield units>"
                },
                "instructions": [
                    "<step 1>",
                    "<step 2>",
                    ...
                ],
                "times": {
                    "prep time": <prep time>,
                    "cook time": <cook time>,
                    "total time": <total time>
                }
            }
            
            - For ingredients without an amount, leave "amount" and "unit" as null.
            - For ingredients with a unit but no amount (e.g., "a pinch of salt"), use common sense (quantity=1, unit=<unit>).
            - For ingredients with no measurable unit (e.g., "2 eggs"), set "food" as "egg," "amount" as 2, and "unit" as null.
            - Avoid plural units.
            - Use the entire description of the food (e.g., "salted butter* (softened)") in the "food" field.
            - Do not use hyphens or special characters. do not use fraction characters. only decimals
            - If no yield is given, leave the yield values null
            - always include all object keys, even if the values are null
            - all quantities in decimal form, not fraction
            - example for ingredients: '2¼ tbsp sugar' should return  {
              "food": "sugar",
              "quantity": {
                  "amount": 2.25,
                  "unit": "tbsp"
              }
          }
            
            use this data: ${props.recipeInput}
            `
            // fetch api
            const openAI = process.env.REACT_APP_OPENAI;
            const options = {
                method: "POST",
                headers: {
                    "Authorization": openAI,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: sentence}],
                    max_tokens: 3000,
                })
            };
            const response = await fetch("https://api.openai.com/v1/chat/completions", options);
            const data = await response.json();
            const gptString = data.choices[0]["message"]["content"];
            
              const gptString1 = JSON.stringify({
                "ingredients": [
                  {
                    "food": "onion powder",
                    "quantity": {
                      "amount": 1,
                      "unit": "tsp"
                    }
                  },
                  {
                    "food": "dried oregano",
                    "quantity": {
                      "amount": 1,
                      "unit": "tsp"
                    }
                  },
                  {
                    "food": "salt",
                    "quantity": {
                      "amount": 1,
                      "unit": "tsp"
                    }
                  },
                  {
                    "food": "dried cumin powder",
                    "quantity": {
                      "amount": 2,
                      "unit": "tsp"
                    }
                  },
                  {
                    "food": "paprika",
                    "quantity": {
                      "amount": 2,
                      "unit": "tsp"
                    }
                  },
                  {
                    "food": "black pepper",
                    "quantity": {
                      "amount": 1/4,
                      "unit": "tsp"
                    }
                  },
                  {
                    "food": "cayenne pepper",
                    "quantity": {
                      "amount": 1/4,
                      "unit": "tsp"
                    }
                  },
                  {
                    "food": "olive oil",
                    "quantity": {
                      "amount": 1/2,
                      "unit": "tbsp"
                    }
                  },
                  {
                    "food": "garlic cloves",
                    "quantity": {
                      "amount": 2,
                      "unit": null
                    }
                  },
                  {
                    "food": "onion",
                    "quantity": {
                      "amount": 1/2,
                      "unit": null
                    }
                  },
                  {
                    "food": "beef mince (ground beef)",
                    "quantity": {
                      "amount": 500,
                      "unit": "g"
                    }
                  },
                  {
                    "food": "tomato paste",
                    "quantity": {
                      "amount": 2,
                      "unit": "tbsp"
                    }
                  },
                  {
                    "food": "water",
                    "quantity": {
                      "amount": 3,
                      "unit": "tbsp"
                    }
                  },
                  {
                    "food": "large soft flour tortillas or round wraps",
                    "quantity": {
                      "amount": 6,
                      "unit": null
                    }
                  },
                  {
                    "food": "cooked rice",
                    "quantity": {
                      "amount": 3,
                      "unit": "cups"
                    }
                  },
                  {
                    "food": "iceberg lettuce or cabbage",
                    "quantity": {
                      "amount": 3,
                      "unit": "cups"
                    }
                  },
                  {
                    "food": "corn kernels",
                    "quantity": {
                      "amount": 1,
                      "unit": "cup"
                    }
                  },
                  {
                    "food": "black beans",
                    "quantity": {
                      "amount": 1,
                      "unit": "cup"
                    }
                  },
                  {
                    "food": "tomatoes",
                    "quantity": {
                      "amount": 3,
                      "unit": null
                    }
                  },
                  {
                    "food": "red onion",
                    "quantity": {
                      "amount": 1/2,
                      "unit": null
                    }
                  },
                  {
                    "food": "coriander / cilantro",
                    "quantity": {
                      "amount": null,
                      "unit": null
                    }
                  },
                  {
                    "food": "shredded cheese of choice",
                    "quantity": {
                      "amount": 1.5,
                      "unit": "cups"
                    }
                  }
                ],
                "yield": {
                  "quantity": null,
                  "units": null
                },
                "instructions": []})
            const gptObj = await JSON.parse(gptString);

            // handle thirds
            if (gptObj.hasOwnProperty("ingredients")) {
            const updatedIngredients = gptObj.ingredients.map(i => {
                if (.66 === parseFloat((i.quantity.amount % 1).toFixed(2))) {
                i.quantity.amount = Math.floor(i.quantity.amount) + 0.6666666;
                } else if (.33 === parseFloat((i.quantity.amount % 1).toFixed(2))) {
                    i.quantity.amount = Math.floor(i.quantity.amount) + 0.3333333;
                    }
                return i;
            });
            
            const updatedGptObj = { ...gptObj, ingredients: updatedIngredients };
            return updatedGptObj
            }

            return gptObj

            } catch (error) {
                console.log(error)
            };
        } else {
          
        }
    }
export default algorithm;

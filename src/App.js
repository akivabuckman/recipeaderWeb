import { useEffect, useState } from "react";
import './App.css';
import Result from "./components/Result";
import Input from "./components/Input";
import Footer from "./components/Footer";
import ClipLoader from "react-spinners/ClipLoader";

function App() {
    const [recipeInput, setRecipeInput] = useState("");
    const [ingredientMeasurements, setIngredientMeasurements] = useState(null)
    const [isloading, setIsLoading] = useState(false)
    const [gptObj, setGptObj] = useState(
        {
            "ingredients":
            [
                // {
                //     "food": null,
                //     "quantity": {
                //         "amount": null,
                //         "unit": null
                //     }
                // }
            ],
            "yield": {
                "quantity": null,
                "units": null
            },
            "instructions": [
            ],
            "times": {
                "prep time": null,
                "cook time": null,
                "total time": null
            }
        }
    );
    const originalObj =
        {
            "ingredients":
            [
                // {
                //     "food": null,
                //     "quantity": {
                //         "amount": null,
                //         "unit": null
                //     }
                // }
            ],
            "yield": {
                "quantity": null,
                "units": null
            },
            "instructions": [
            ],
            "times": {
                "prep time": null,
                "cook time": null,
                "total time": null
            }
        }
    
    const [factor, setFactor] = useState(1);

    useEffect(()=> {
        const loadingP = document.getElementById("loadingDiv");
        const yieldView = document.getElementById("yieldView");
        const instructionsView = document.getElementById("instructionsView");
        const ingredientsView = document.getElementById("ingredientsView")
        if (loadingP) {
             loadingP.style.display= isloading ? "flex" : "none";
        };

        if (yieldView) {
            yieldView.style.display= isloading ? "none" : "flex";
       };

       if (instructionsView) {
        instructionsView.style.display= isloading ? "none" : "flex";
        };
        if (ingredientsView) {
            ingredientsView.style.display= isloading ? "none" : "flex";
            };
        

    }, [isloading])
    const Loggy = () => {
      return(
        <button onClick={()=>{
            console.log(recipeInput)
            }}>
          <p>Log</p>
        </button>
      )
    }
  return (
    <div className="App">
       <div
                    style={{
                        flex: 1,
                    }}
                >
                    <Input isloading={isloading} setIsLoading={setIsLoading} recipeInput={recipeInput} setRecipeInput={setRecipeInput} gptObj={gptObj} setGptObj={setGptObj}/>
                    
                    {
                        JSON.stringify(gptObj) !== JSON.stringify(originalObj) ?
                    <Result 
                    isloading={isloading} setIsLoading={setIsLoading} 
                    recipeInput={recipeInput} 
                    setRecipeInput={setRecipeInput} 
                    gptObj={gptObj} 
                    setGptObj={setGptObj}
                    ingredientMeasurements={ingredientMeasurements}
                    setIngredientMeasurements={setIngredientMeasurements}
                    factor={factor}
                    setFactor={setFactor}
                    />
                    : null 
                    }
                </div>
                <Footer />

    </div>
  );
}

export default App;

import { useEffect, useState } from "react";
import algorithm from "../utils/algorithm";
import Button from '@mui/material/Button';
import { Fraction } from 'fractional';
import TextField from '@mui/material/TextField';
import ClipLoader from "react-spinners/ClipLoader";


const Input = (props) => {

    const handleInputChange = (e) => {
        props.setRecipeInput(e.target.value);
    };

    const removeExtraQuantities = (gptObject) => {
        // Object.keys(gptObject.ingredients).forEach((i) => {
        //   if (gptObject.ingredients[i] && gptObject.ingredients[i].quantity && gptObject.ingredients[i].food.includes(gptObject.ingredients[i].quantity.unit)) {
        //     const unitStartIndex = gptObject.ingredients[i].food.indexOf(gptObject.ingredients[i].quantity.unit);
        //     const unitLength = gptObject.ingredients[i].quantity.unit.length;
        //     const unitSpaceEnd = unitStartIndex + unitLength + 1;
        //     const newFood = gptObject.ingredients[i].food.slice(unitSpaceEnd);
        //     gptObject.ingredients[i].food = newFood;
        //   }
        // });
   };

   const decimalToFraction1 = (gptObject) => {
            Object.keys(gptObject.ingredients).forEach((i) => {
              // Convert the decimal to a fraction
              let numerator = gptObject.ingredients[i].quantity.amount * 1000; // Use a larger number to increase precision
              let denominator = 1000; // The initial denominator
            
              // Find the greatest common divisor (GCD) of the numerator and denominator using an iterative approach
              while (denominator !== 0) {
                const temp = denominator;
                denominator = numerator % denominator;
                numerator = temp;
              }

            
              // Simplify the fraction by dividing both the numerator and denominator by the GCD
              numerator /= 1000;
              denominator /= 1000;
            
              // Check if the fraction can be simplified further (e.g., 2/4 should be 1/2)
              while (numerator % 10 === 0 && denominator % 10 === 0) {
                numerator /= 10;
                denominator /= 10;
              }
            
              // Check if the fraction can be expressed as a mixed number
              if (numerator >= denominator) {
                const wholePart = Math.floor(numerator / denominator);
                numerator %= denominator;
                gptObject.ingredients[i].quantity.amount = `${wholePart} ${numerator}/${denominator}`;
              }
            
              gptObject.ingredients[i].quantity.amount = `${numerator}/${denominator}`;
            })
        
    };

    const decimalToFraction = (gptObject) => {
      const dfConversions = {
        .5: "1/2",
        .33: "1/3",
        .66: "2/3",
        .25: "1/4",
        .75: "3/4",
        .2: "1/5",
        .4: "2/5",
        .6: "3/5",
        .8: "4/5",
        .166: "1/6",
        .167: "1/6",
        .16: "1/6",
        .17: "1/6",
        .83: "5/6",
        .833: "5/6",
        .125: "1/8",
        .13: "1/8",
        .12: "1/8",
        .375: "3/8",
        .37: "3/8",
        .38: "3/8",
        .625: "5/8",
        .62: "5/8",
        .63: "5/8",
        .875: "7/8",
        .87: "7/8",
        .08: "1/12",
        .083: "1/12",
        .416: "5/12",
        .42: "5/12",
        .41: "5/12",
        .583: "7/12",
        .58: "7/12",
        .916: "11/12",
        .917: "11/12",
        .92: "11/12",
        .0625: "1/16",
        .06: "1/16",
        .062: "1/16",
        .063: "1/16",
        .1875: "3/16",
        .187: "3/16",
        .188: "3/16",
        .18: "3/16",
        .19: "3/16",
        .3125: "5/16"
      }
      Object.keys(gptObject.ingredients).forEach((i) => {
        if (gptObject.ingredients[i].quantity.amount % 1 !== 0) {
          const frac = new Fraction(gptObject.ingredients[i].quantity.amount)
        }
      })
    }

    
    const callAlgorithm = async () => {
      if (process.env.REACT_APP_LOAD === "fake") {
        props.setIsLoading(true);

      setTimeout(function() {
      // Get a reference to the element with the id "loadingP"
      const element = document.getElementById("loadingDiv");

      // Check if the element exists
      if (element) {
        // Scroll to the element
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        console.error("Element with id 'loadingDiv' not found.");
      }
    }, 500);
      try {
        const gptObject = await algorithm(props);

        if (gptObject) {
          props.setGptObj(gptObject);
          removeExtraQuantities(gptObject);
          setTimeout(() => {
            props.setIsLoading(false);
          }, 2000);
        }
      } catch (error) {
        console.log(error)
      }
      } else {
        props.setIsLoading(true);
        setTimeout(function() {
          // Get a reference to the element with the id "loadingP"
          const element = document.getElementById("loadingDiv");
    
          // Check if the element exists
          if (element) {
            // Scroll to the element
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          } else {
            console.error("Element with id 'loadingDiv' not found.");
          }
        }, 500);
        try {
          const gptObject = await algorithm(props);
  
          if (gptObject) {
            props.setGptObj(gptObject);
            props.setIsLoading(false);
            setTimeout(function() {
              // Get a reference to the element with the id "loadingP"
              const yieldDiv = document.getElementById("yieldDiv");
        
              // Check if the element exists
              if (yieldDiv) {
                // Scroll to the element
                yieldDiv.scrollIntoView({ behavior: "smooth", block: "start" });
              } else {
                console.error("Element with id 'loadingDiv' not found.");
              }
            }, 500);

          }
        } catch (error) {
          console.log(error)
        }
      }
      
    };
    

    const styles = ({
      container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
      },
      title: {
        marginBottom: 10
      },
      label: {
        fontSize: 16,
        marginBottom: 10,
      },
      TextField: {
        height: 100,
        width: "100%",
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
      },
      button: {
        backgroundColor: "#0f6bea",
        width: "100%",
      },
    });
  

    return (
        <div className={"inputDiv"} >
          <h1 style={styles.title}>Recipeader</h1>
          <p style={styles.label} id={"subtitle"}>...like "recipe" + "reader", get it?</p>
        <p style={styles.label}>Copy-paste recipe ingredients, instructions, and yield (optional) into the box, then click "Go!".</p>
        <TextField
          id="outlined-basic"
          label="Recipe"
          variant="outlined"
          multiline
          textAlignVertical="top"
          error={props.recipeInput.length > 5000}
          helperText={props.recipeInput.length > 5000 ? "Too long. Only include actual recipe": ""}
          onChange={handleInputChange}
          minRows={20}
          maxRows={20}
          style={{ width: '80%', marginBottom: 30}}

        />
        <Button
            variant="contained"
            onClick={() => callAlgorithm(props.gptObj)}
            loading={props.isloading}
            disabled={props.recipeInput === ""}
            style={{width: "80%"}}
        >
          Go!
        </Button>
        <div id="loadingDiv">
        <ClipLoader
            // color={color}
            loading={props.isloading}
            // cssOverride={override}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
        />
            <p>
                Doing some magic. This will take 2 minutes - go grab some ingredients in the meantime!    
            </p>
      </div>
      </div>
    )
}

export default Input
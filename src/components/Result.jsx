import { useEffect, useState } from "react";
import quantityCalculator from "../utils/quantityCalculator";
import YieldButton from "./YieldButton";
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import ClipLoader from "react-spinners/ClipLoader";
import { MenuItem } from "@mui/material";
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';



const Result = (props) => {
  const Fraction = require('fractional').Fraction
  const [ingredientChecks, setIngredientChecks] = useState(
    props.gptObj
      ? props.gptObj.hasOwnProperty("ingredients") ? props.gptObj.ingredients.map(() => false)
      : []
  : []);
  const [instructionChecks, setInstructionChecks] = useState(
    props.gptObj
    ? props.gptObj.hasOwnProperty("instructions") ? props.gptObj.instructions.map(()=> true)
    : []
    : []);
    const [yields, setYields] = useState([]);
    const [fractions, setFractions] = useState([]);
    const [displayFractions, setDisplayFractions] = useState([]);
    const [currentInput, setCurrentInput] = useState({"change": null, "text": null, "index": null});
    const [inputWidth, setInputWidth] = useState(70);
    const [givenYield, setGivenYield] = useState(0)

  useEffect(() => {
    quantityCalculator(props);
    if (props.gptObj) {
        setIngredientChecks(props.gptObj.ingredients.map(() => false));
        setInstructionChecks(props.gptObj.instructions.map(() => false));
        props.setFactor(1)
    };

    if (props.gptObj && props.gptObj.hasOwnProperty("yield")) {
        const yields = [];

        if (props.gptObj.yield.quantity !== null && props.gptObj.yield.quantity !== 0 && props.gptObj.yield.quantity !== ""){
          for (let i = 0.25; i <= 3; i += 0.25) {
            yields.push(i * props.gptObj.yield.quantity);
          };
          setYields(yields)
        } else {
          for (let i = 0.25; i <= 3; i += 0.25) {
            yields.push(i);
          };
          setYields(yields)
        }   
    };
    setGivenYield(props.gptObj.yield.quantity ?? 1)
    decimalsToFractions();
  }, [props.gptObj]);


  const handleYieldChange1 = (e) => {
    const text = e.target.value;
    setGivenYield(text)
    if (!["", "0"].includes(text) && !isNaN(text)) {
      setCurrentInput({"change": "yield", "text": text, "index": null})
      props.setFactor(parseFloat(text))
    }
  }

  const handleQuantityYieldChange = (e) => {
    const text = e.target.value;
    setGivenYield(text);
    if (!["", "0"].includes(text) && !isNaN(text)) {
      setCurrentInput({"change": "yield", "text": text, "index": null})
    props.setFactor(e.target.value / props.gptObj.yield.quantity);
  }}

  const ingredientCheckChange = (index) => {
    setIngredientChecks((prevChecks) => {
      const newChecks = [...prevChecks];
      newChecks[index] = !newChecks[index];
      return newChecks;
    });
  };

  const instructionCheckChange = (index) => {
    const prevChecks = instructionChecks;
      const newChecks = [...prevChecks];
      newChecks[index] = !newChecks[index];
    setInstructionChecks(newChecks)
  };

  const decimalsToFractions = () => {
    let newFractions = [];
    props.gptObj.ingredients.forEach((i)=>{
      // if null
      if (!i.quantity.amount) {
        newFractions.push("")
      } else {
        const rough = i.quantity.amount * props.factor;
        const j = roundToFraction(rough);
        if (.32 <= (j) % 1 && j % 1 <= .34) {
          const frac = "1/3";
          const mod = Math.floor(j) === 0 ? "" : `${Math.floor(j)} `;
          newFractions.push(`${mod}${frac} `)
        }
        // if 2/3
        else if (.65 <= (j) % 1 && j % 1 <= .67 ) {
          const frac = "2/3";
          const mod = Math.floor(j) === 0 ? "" : `${Math.floor(j)} `;
          newFractions.push(`${mod}${frac} `)
        }
        // if 1/6
        else if (.15 <= (j) % 1 && j % 1 <= .17 ) {
          const frac = "1/6";
          const mod = Math.floor(j) === 0 ? "" : `${Math.floor(j)} `;
          newFractions.push(`${mod}${frac} `)
        }
        // if 5/6
        else if (.82 <= (j) % 1 && j % 1 <= .84 ) {
          const frac = "5/6";
          const mod = Math.floor(j) === 0 ? "" : `${Math.floor(j)} `;
          newFractions.push(`${mod}${frac} `)
        }
        // if 1/12
        else if (.08 <= j % 1 && j % 1 <=.084) {
          const frac = "1/12";
          const mod = Math.floor(j) === 0 ? "" : `${Math.floor(j)} `;
          newFractions.push(`${mod}${frac} `)
        }
        // if 5/12
        else if (.41 <= j % 1 && j % 1 <=.43) {
          const frac = "5/12";
          const mod = Math.floor(j) === 0 ? "" : `${Math.floor(j)} `;
          newFractions.push(`${mod}${frac} `)
        }

        // if 11/12
        else if (.915 <= j % 1 && j % 1 <=.92) {
          const frac = "11/12";
          const mod = Math.floor(j) === 0 ? "" : `${Math.floor(j)} `;
          newFractions.push(`${mod}${frac} `)
        }
        // if other decimal
        else if (j % 1 !== 0) {
          const frac = new Fraction(j);
          newFractions.push(frac.toString())
        }
        // if whole
        else if (!isNaN(j)) {
          newFractions.push((j).toString())
        }
      }
    })
    setFractions(newFractions)
    setDisplayFractions(newFractions)
  };

  useEffect(()=>{
    const maxLen = Math.max(...displayFractions.map(el => el.length));

    if (maxLen !== 0) {
      setInputWidth(Math.max(maxLen * 12, 70))
    }
  }, [displayFractions])

  const decimalsToFractions1 = () => {
    const text = currentInput.text;
    const index = currentInput.index;
    if (currentInput.change) {
      let newFractions = [];
      props.gptObj.ingredients.forEach((i)=>{
        const ingredientsIndex = props.gptObj.ingredients.indexOf(i);
        if (ingredientsIndex === index) {

          newFractions.push(text)
        } else if (!i.quantity.amount) {
        // if null
          newFractions.push("")
        } else {
          const rough = i.quantity.amount * props.factor;
          const j = roundToFraction(rough);
          // if 1/3
          if (.32 <= (j) % 1 && j % 1 <= .34) {
            const frac = "1/3";
            const mod = Math.floor(j) === 0 ? "" : `${Math.floor(j)}`;
            newFractions.push(`${mod} ${frac}`)
          }
          // if 2/3
          else if (.65 <= (j) % 1 && j % 1 <= .67 ) {
            // console.log(ingredientsIndex, j, 143)
            const frac = "2/3";
            const mod = Math.floor(j) === 0 ? "" : `${Math.floor(j)}`;
            newFractions.push(`${mod} ${frac}`)
          }
          // if 1/6
          else if (.15 <= (j) % 1 && j % 1 <= .17 ) {
            // console.log(ingredientsIndex, j, 150)
            const frac = "1/6";
            const mod = Math.floor(j) === 0 ? "" : `${Math.floor(j)}`;
            newFractions.push(`${mod} ${frac}`)
          }
          // if 5/6
          else if (.82 <= (j) % 1 && j % 1 <= .84 ) {
            // console.log(ingredientsIndex, j, 157)
            const frac = "5/6";
            const mod = Math.floor(j) === 0 ? "" : `${Math.floor(j)}`;
            newFractions.push(`${mod} ${frac}`)
          }
          // if 1/12
          else if (.08 <= j % 1 && j % 1 <=.084) {
            const frac = "1/12";
            const mod = Math.floor(j) === 0 ? "" : `${Math.floor(j)}`;
            newFractions.push(`${mod} ${frac} `)
          }
          // if 5/12
          else if (.41 <= j % 1 && j % 1 <=.43) {
            const frac = "5/12";
            const mod = Math.floor(j) === 0 ? "" : `${Math.floor(j)}`;
            newFractions.push(`${mod} ${frac} `)
          }

          // if 7/12
          else if (.582 <= j % 1 && j % 1 <=.584) {
            const frac = "5/12";
            const mod = Math.floor(j) === 0 ? "" : `${Math.floor(j)}`;
            newFractions.push(`${mod} ${frac} `)
          }

          // if 11/12
          else if (.915 <= j % 1 && j % 1 <=.92) {
            const frac = "11/12";
            const mod = Math.floor(j) === 0 ? "" : `${Math.floor(j)}`;
            newFractions.push(`${mod} ${frac} `)
          }

          // if 1/9
          else if (.11 <= j % 1 && j % 1 <=.12) {
            const frac = "11/12";
            const mod = Math.floor(j) === 0 ? "" : `${Math.floor(j)}`;
            newFractions.push(`${mod} ${frac} `)
          }

          // if 1/9
          else if (.22 <= j % 1 && j % 1 <=.23) {
            const frac = "11/12";
            const mod = Math.floor(j) === 0 ? "" : `${Math.floor(j)}`;
            newFractions.push(`${mod} ${frac} `)
          }

          // if 1/9
          else if (.44 <= j % 1 && j % 1 <=.45) {
            const frac = "11/12";
            const mod = Math.floor(j) === 0 ? "" : `${Math.floor(j)}`;
            newFractions.push(`${mod} ${frac} `)
          }

          // if 1/9
          else if (.55 <= j % 1 && j % 1 <=.56) {
            const frac = "11/12";
            const mod = Math.floor(j) === 0 ? "" : `${Math.floor(j)}`;
            newFractions.push(`${mod} ${frac} `)
          }

          // if 7/9
          else if (.77 <= j % 1 && j % 1 <=.78) {
            const frac = "11/12";
            const mod = Math.floor(j) === 0 ? "" : `${Math.floor(j)}`;
            newFractions.push(`${mod} ${frac} `)
          }

          // if 1/9
          else if (.88 <= j % 1 && j % 1 <=.89) {
            const frac = "11/12";
            const mod = Math.floor(j) === 0 ? "" : `${Math.floor(j)}`;
            newFractions.push(`${mod} ${frac} `)
          }

          // if 1/16
          else if (.0624 <= j % 1 && j % 1 <=.0626) {
            const frac = "1/16";
            const mod = Math.floor(j) === 0 ? "" : `${Math.floor(j)}`;
            newFractions.push(`${mod} ${frac} `)
          }
          

          // if 1/9
          else if (.1874 <= j % 1 && j % 1 <=.1876) {
            const frac = "3/16";
            const mod = Math.floor(j) === 0 ? "" : `${Math.floor(j)}`;
            newFractions.push(`${mod} ${frac} `)
          }

          // if 1/9
          else if (.3124 <= j % 1 && j % 1 <=.3126) {
            const frac = "5/16";
            const mod = Math.floor(j) === 0 ? "" : `${Math.floor(j)}`;
            newFractions.push(`${mod} ${frac} `)
          }

          // if 1/9
          else if (.4374 <= j % 1 && j % 1 <=.4376) {
            const frac = "7/16";
            const mod = Math.floor(j) === 0 ? "" : `${Math.floor(j)}`;
            newFractions.push(`${mod} ${frac} `)
          }

          // if 1/9
          else if (.5624 <= j % 1 && j % 1 <=.5626) {
            const frac = "9/16";
            const mod = Math.floor(j) === 0 ? "" : `${Math.floor(j)}`;
            newFractions.push(`${mod} ${frac} `)
          }

          // if 1/9
          else if (.6874 <= j % 1 && j % 1 <=.6876) {
            const frac = "11/16";
            const mod = Math.floor(j) === 0 ? "" : `${Math.floor(j)}`;
            newFractions.push(`${mod} ${frac} `)
          }

          // if 1/9
          else if (.8124 <= j % 1 && j % 1 <=.8126) {
            const frac = "13/16";
            const mod = Math.floor(j) === 0 ? "" : `${Math.floor(j)}`;
            newFractions.push(`${mod} ${frac} `)
          }

          // if 1/9
          else if (.9374 <= j % 1 && j % 1 <=.9376) {
            const frac = "15/16";
            const mod = Math.floor(j) === 0 ? "" : `${Math.floor(j)}`;
            newFractions.push(`${mod} ${frac} `)
          }


          // if other decimal
          else if (j % 1 !== 0) {
            const frac = new Fraction(j);
            newFractions.push(frac.toString())
          }
          // if whole
          else if (!isNaN(j)) {
            newFractions.push((j).toString())
          }
        }
      });

      setFractions(newFractions);
      setDisplayFractions(newFractions)
    }
  };

  const roundToFraction = (rough) => {
    const fractions = [0, 1, 1/16, 2/16, 3/16, 4/16, 5/16, 6/16, 7/16, 8/16, 9/16, 10/16, 11/16, 12/16, 13/16, 14/16, 15/16, 1/12, 2/12, 4/12, 5/12, 7/12, 8/12, 10/12, 11/12, 1/10, 2/10, 3/10, 4/10, 6/10, 7/10, 8/10, 9/10, .99999]
    let wholeNum = Math.floor(rough);
    const remainder = rough % 1;
    let smallestDiff = 999;
    let closestFraction;
    for (let i of fractions) {
      const diff = Math.abs(i % 1 - remainder);
      if (diff < smallestDiff) {
        closestFraction = i;
        smallestDiff = diff;
      }
    };

    // if it makes it whole 
    if (closestFraction === .99999) {
      closestFraction = 0;
      wholeNum ++;
    }

    return wholeNum + closestFraction;
  }


  
  

  const Loggy = () => {

      return (
        <button
          onClick={() => {
            console.log(currentInput)
          }}
        >
          Logggg result
        </button>
      );
    };
  const styles = ({
    ingredientDiv: {
      display: "flex",
      alignItems: "center"
    },
    container: {
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    yieldView: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    ingredientsView: {
      marginBottom: 20,
    },
    ingredientRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 5,
    },
    instructionsView: {
      marginBottom: 20,
    },
    instructionRow: {
      flexDirection: "row",
      alignItems: "top",
      marginBottom: 5,
    },
    title: {
      fontSize: 20,
      marginBottom: 20,
      color: "#2074d4",
      fontWeight: "bolder"
    }
  });

  const handleIngredientFactor = (index, e) => {
    const text = e.target.value;
    setCurrentInput({"change": "ingredient", "text": text, "index": index})
    const newFractions = fractions;
    newFractions[index] = text;
    setDisplayFractions(newFractions)
    if (!["", "0"].includes(text) && !isNaN(text)) {
      props.setFactor(parseFloat(text) / props.gptObj.ingredients[index].quantity.amount)
      if ([0, null, ""].includes(props.gptObj.yield.quantity)) {
        setGivenYield(parseFloat(text) / props.gptObj.ingredients[index].quantity.amount)
      } else {
        setGivenYield(parseFloat(text) / props.gptObj.ingredients[index].quantity.amount * props.gptObj.yield.quantity)
      }
    }
    // decimalsToFractions1(index, text)
  }


  useEffect(() => {
    decimalsToFractions1()
  }, [props.factor])


  return (
    
    <div id="resultsDiv" style={styles.container}>
      {/* <div id="loadingDiv">
        <ClipLoader
            // color={color}
            loading={props.isloading}
            // cssOverride={override}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
        />
            <p>
                Loading. This will take 2 minutes - go grab some ingredients in the meantime!    
            </p>
      </div> */}

    {/* Yield Section */}
    {props.gptObj ? (
      <div id="yieldDiv">
        {/* if quantity is null */}
        {props.gptObj.yield.quantity === null || props.gptObj.yield.quantity === 0 || props.gptObj.yield.quantity === "" ? (
         <div className="yieldDiv">
            <TextField 
              error={isNaN(givenYield)}
              helperText={isNaN(givenYield) ? "Whole numbers or decimals only" : ""}
              label={"Yield Factor"}
              onChange={handleYieldChange1}
              value={givenYield}
              style={{height: "55px", width: "40%"}}
              inputMode="numberic"
            />

            <Button
                variant="outlined"
                onClick={() => {
                  setCurrentInput({"change": "yield", "text": null, "index": null});
                  props.setFactor(1); 
                  setGivenYield(1)}}
                style={{height: "55px", width: "40%"}}
                    >
                  Reset Yield
            </Button>
          </div>
            // quantity is not null, units is null
        ) : props.gptObj.yield.units === null || props.gptObj.yield.units === "" || props.gptObj.yield.units === 0 ? (

            <div className="yieldDiv">
            <TextField 
              label={"Yield"}
              onChange={handleQuantityYieldChange}
              value={givenYield}
              style={{height: "55px", width: "40%"}}
              inputMode="numberic"
              error={isNaN(givenYield)}
              helperText={isNaN(givenYield) ? "Whole numbers or decimals only" : ""}
            />
            <Button
                variant="outlined"
                onClick={() => {
                  setCurrentInput({"change": "yield", "text": null, "index": null});
                  props.setFactor(1); 
                  setGivenYield(props.gptObj.yield.quantity)}}
                style={{height: "55px", width: "40%"}}
                    >
                  Reset Yield
            </Button>
          </div>
        ) : (
          // neither are null
          <div className="yieldDiv">
            <TextField 
              label={props.gptObj.yield.units.charAt(0).toUpperCase() + props.gptObj.yield.units.slice(1)}
              onChange={handleQuantityYieldChange}
              value={givenYield}
              style={{height: "55px", width: "40%"}}
              inputMode="numberic"
              error={isNaN(givenYield)}
              helperText={isNaN(givenYield) ? "Whole numbers or decimals only" : ""}
            />
            <Button
                variant="outlined"
                onClick={() => {
                  setCurrentInput({"change": "yield", "text": null, "index": null});
                  props.setFactor(1); 
                  setGivenYield(props.gptObj.yield.quantity)}}
                style={{height: "55px", width: "40%"}}
                    >
                  Reset {props.gptObj.yield.units.charAt(0).toUpperCase() + props.gptObj.yield.units.slice(1)} Count
            </Button>
          </div>
        )}
      </div>
    ) : null}

    {/* Ingredients Section */}
    <div id="ingredientsView" style={styles.ingredientsView}>
      {props.gptObj ? (
        <div>
          <p style={styles.title}>Ingredients:</p>
          {props.gptObj.ingredients.map((ingredient, index) => (
            <div className="ingredientDiv" key={index} style={styles.ingredientDiv}>
              <Checkbox 
                onClick={()=>{ingredientCheckChange(index)}}
                checked={ingredientChecks[index]}
              />
                <TextField
                error={isNaN(displayFractions[index]) && currentInput.index === index}
                helperText={isNaN(displayFractions[index]) && currentInput.index === index ? "Whole numbers or decimals only" : ""}
                defaultValue={displayFractions[index] ? displayFractions[index] : ''}
                onChange={(e) => handleIngredientFactor(index, e)}
                disabled={props.gptObj.ingredients[index].quantity.amount === null}
                size="small"
                style = {{width: inputWidth, minWidth: inputWidth, marginRight: 10}}
                value={displayFractions[index] ? displayFractions[index] : ''}
                  />
              <p>{ingredient.quantity.unit} {ingredient.food}</p>

                  

            </div>
          ))}
        </div>
      ) : null}
    </div>

    {/* Instructions Section */}
    <div id="instructionsView" style={styles.instructionsView}>
      {props.gptObj && props.gptObj.instructions.length > 0 ? (
        <div>
          <p style={styles.title}>Instructions:</p>
          {/* {props.gptObj.instructions.map((instruction, index) => (
            <div style={styles.instructionRow} key={index}>
              <Checkbox
                  status={instructionChecks[index] === true ? 'checked' : "unchecked"}
                  onPress={() => {
                  instructionCheckChange(index);
                }}
              />
              <p
                style={{
                  textDecorationLine: instructionChecks[index] ? "line-through" : "none",
                }}
              >
                {index + 1}. {instruction}
              </p>
            </div>
          ))} */}
          <FormGroup>
            {props.gptObj.instructions.map((instruction, index) => (
              <FormControlLabel 
                sx={{ 
                  alignItems: 'flex-start', 
                  textDecoration: instructionChecks[index] ? 'line-through' : 'none', 
                  color: instructionChecks[index] ? 'grey' : 'black'
                }} 
                control={<Checkbox sx={{marginTop: -1}} 
                onChange={()=>instructionCheckChange(index)}/>} 
                labelPlacement="end" 
                label={`${index + 1}. ${instruction}`} 
              />
            ))}
          </FormGroup>
        </div>
      ) : null}
    </div>
  </div>
);
};

export default Result;

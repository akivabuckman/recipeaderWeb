import Select from '@mui/material/Select';


const YieldButton = (props) => {
    return(
        <Select
            data={props.data}
            defaultButtonText="↕️ 1X"
            defaultValue={"1X"}
            onSelect={(selectedItem, index) => {
              props.handleFactorChange(selectedItem.slice(0, -1));
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return `↕️ ${selectedItem}`;
            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}
            buttonStyle={{width:"100px"}}
            buttonTextStyle={{color: "#0f6bea"}}
            dropdownStyle={{height:"480px"}}
            rowStyle={{minHeight:"40px"}}
            />
    )
}

export default YieldButton
import React from 'react'
import prof1 from "../../static/profile-type1.png";
import prof2 from "../../static/profile-type2.png";
import {colours} from "../../pages/profileDesigns/colour.util";

export default class DesignPanel extends React.Component
{
    colourButton = (theme, key) =>
    {
        return <button className={"colour-theme-button"} key={key} style={{
            background: `linear-gradient(135deg, ${theme.background} 50%, ${theme.card} 50%)`
        }} onClick={() => this.props.updateProfileColours(key)}/>
    }

    colourButtons = (themes) =>
    {
        return themes.map((theme, key) => (
            this.colourButton(theme, key)
        ))
    }

    render()
    {
        return <>
            <h3 className="m p-no-margin-top p-no-margin-bottom">Change
                profile design</h3>
            <div className='list-button-container'>
                <button className="button unraised link-img" type="button"
                        onClick={() => this.props.updateProfileDesign(1)}>
                    <img src={prof1} alt={'Profile type 1'}/>
                </button>
                <button style={{marginLeft: "10%"}} className="button unraised link-img"
                        onClick={() => this.props.updateProfileDesign(2)}>
                    <img src={prof2} alt={'Profile type 2'}/>
                </button>
            </div>
            <div className={"theme-picker-buttons"}>
                {this.colourButtons(colours)}
            </div>

        </>
    }
}
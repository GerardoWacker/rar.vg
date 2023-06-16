import React from "react";
import './editpanel.component.css'
import config from "../../config/config.json";

export default class EditPanel extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            field1: null,
            field2: null,
        }

        this.handleField1Change = this.handleField1Change.bind(this)
        this.handleField2Change = this.handleField2Change.bind(this)
    }

    handleField1Change(event)
    {
        this.setState({field1: event.target.value})
    }

    handleField2Change(event)
    {
        this.setState({field2: event.target.value})
    }

    saveLocally = (content) =>
    {
        this.props.updateLocally(content)
    }

    cancel = () =>
    {
        this.props.cancelSelection()
    }

    renderFields = (component) =>
    {
        if (!component)
            return <div className={"default"}>
                <div>
                    <span className={"m"}>Start editing</span><br/><br/>
                    <span className={"s"}>Click on a component to begin editing</span><br/>
                    <span className={"s"}>Drag a component to change its position</span>
                </div>
            </div>
        switch (component.type)
        {
            case 'user':
                return <>
                    <h3 className="m p-no-margin-top p-no-margin-bottom">Modificar usuario</h3>
                    <div className="top">
                        <div className="button-center">
                            <button className="user-button"
                                    style={{backgroundImage: "url(" + config.endpoint.host + "/avatar/" + component.content.id + ".png"}}/>
                        </div>
                        <h2 className="mm p-no-margin-bottom p-no-margin-top">Nombre a mostrar:</h2>
                    </div>
                    <div className="bottom">
                        <input className="input" type="text"
                               onChange={this.handleField2Change}/>
                        <button className="delete-button">Eliminar cuenta</button>
                        <button className="done-button"
                                onClick={() => this.props.updateUserDisplayName(this.state.field2)}>Done
                        </button>
                    </div>
                </>
            case 'sociallinks':
                return <>
                    <span>linksk</span>
                </>
            case 'generic':
                return <>
                    <h3 className="m p-no-margin-top p-no-margin-bottom">Edit generic component</h3>
                    <h2 className="s p-no-margin-bottom p-no-margin-top title">Title:</h2>
                    <input className="input" type="text" placeholder="Title" onChange={this.handleField1Change}/>
                    <h2 className="s p-no-margin-bottom p-no-margin-top description">Description:</h2>
                    <textarea className="description-text-box-size" type="text"
                              placeholder="Description" onChange={this.handleField2Change}/>
                    <div className={"button-container"}>
                        <button className="button unraised" onClick={() => this.cancel()}>Cancel</button>
                        <button className="button" onClick={() => this.saveLocally({
                            title: this.state.field1,
                            description: this.state.field2
                        })}>Done
                        </button>
                    </div>
                </>
            case 'pdf':
                return <>
                    <h3 className="m p-no-margin-top p-no-margin-bottom">Edit PDF component</h3>
                    <button className="file-button">Upload file</button>
                    <h2 className="s p-no-margin-bottom p-no-margin-top">Remember: only .pdf files allowed!</h2>
                    <div className="pdf">
                        <object data="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                                type="application/pdf"></object>
                    </div>
                    <div className="margin-button">
                        <button className="done-button">Done</button>
                    </div>
                </>
        }
    }

    render()
    {
        return <div className="outer-mock">
            {this.renderFields(this.props.selectedComponent)}
        </div>
    }
}
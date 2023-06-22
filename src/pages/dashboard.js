import React from "react";
import {tryUserLoading, updateProfile} from "../utils/session.util";
import config from '../utils/config.util'

import './dashboard.css'
import EditableProfile from "../components/editableprofile.component";
import EditPanel from "../components/editpanel.component";

export default class Dashboard extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            user: null,
            component: null,
            unpublished: null,
            showModal: false,
            lastReloaded: Date.now()
        }

        this.editPanel = React.createRef()
    }

    componentDidMount()
    {
        tryUserLoading().then(response =>
        {
            if (!response.success)
                return window.location.href = "/login"

            this.setState({user: response.content.user})
        })
    }

    updateProfile = () =>
    {
        updateProfile(JSON.stringify(this.state.user.components), JSON.stringify(this.state.user.sociallinks))
            .then(response =>
            {
                if (!response.success)
                    console.error(response.content)

                this.displayMessage({type: 'success', message: "Changes published successfully!"})
            })
    }

    updateComponentOrder = (from, to) =>
    {
        const oldUser = this.state.user
        let f = oldUser.components.splice(from, 1)[0];
        oldUser.components.splice(to, 0, f);
        this.setState({
            user: oldUser,
            component: this.state.component === from ? to : this.state.component + 1
        })
        this.displayMessage({type: 'important', message: "You've got unsaved changes!"}, true)
    }

    selectComponent = (key) =>
    {
        this.editPanel.current.clearState()
        this.setState({component: key})
    }

    cancelSelection = () =>
    {
        this.setState({component: null})
    }

    updateComponentLocally = (content) =>
    {
        this.updateComponentLocallyWithoutCancelling(content)
        this.cancelSelection()
    }

    updateComponentLocallyWithoutCancelling = (content) =>
    {
        const oldUser = this.state.user
        oldUser.components[this.state.component].content = content
        this.setState({user: oldUser})
        this.displayMessage({type: 'important', message: "You've got unsaved changes!"}, true)
    }

    updateDisplayName = (displayName) =>
    {
        if (displayName !== "")
        {
            this.setState({user: {...this.state.user, displayName: displayName}})
            this.displayMessage({type: 'important', message: "You've got unsaved changes!"}, true)
        }
        this.cancelSelection()
    }

    drawMessage(message)
    {
        if (message) return (
            <div className={"notice " + message.type}>
                {message.message}
            </div>
        )
    }

    addComponent(type)
    {
        let newComponent = {type: type, content: null}
        switch (type)
        {
            case 'generic':
                newComponent.content = {
                    title: "This is a generic component",
                    description: "You can edit me by filling the fields on the edition panel."
                }
                break;
            case 'pdf':
                newComponent.content = {fileId: null}
                break;
            case 'linklist':
                newComponent.content = {
                    links: [{
                        "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        "title": "This is a link"
                    }]
                }
                break;
            default:
                return;
        }
        const oldUser = this.state.user;
        oldUser.components.push(newComponent)
        this.setState({user: oldUser})
        this.displayMessage({type: 'important', message: "You've got unsaved changes!"}, true)
        this.toggleModal()
        this.selectComponent(this.state.user.components.length - 1)
    }

    updateLinks = (links) =>
    {
        const oldUser = this.state.user
        oldUser.sociallinks = links
        this.setState({user: oldUser})
    }

    displayMessage = (message, persistent) =>
    {
        this.setState({unpublished: message})
        if (!persistent) setTimeout(() => this.setState({unpublished: null}), 5000)
    }

    getSelectedComponent(id)
    {
        switch (id)
        {
            case -2:
                return {type: 'user'}
            case -1:
                return {type: 'sociallinks'}
            default:
                return this.state.user.components[id]
        }
    }

    toggleModal = () =>
    {
        this.dialog.open ? this.dialog.close() : this.dialog.showModal()
    }

    reloadImage = () =>
    {
        this.setState({lastReloaded: Date.now()})
    }

    render()
    {
        if (!this.state.user) return 'Loading...'
        return <div className="dashboard-container">
            <div className="dash-container">
                <dialog className={"dashboard-modal"} ref={ref => this.dialog = ref}>
                    <span className={"m"}>Select component to add:</span>
                    <div className={"component-types-container"}>
                        <button onClick={() => this.addComponent('generic')} className={"component-to-select s"}>Generic
                            component
                        </button>
                        <button onClick={() => this.addComponent('pdf')} className={"component-to-select s"}>PDF
                            reader
                        </button>
                        <button onClick={() => this.addComponent('linklist')} className={"component-to-select s"}>Custom
                            link list
                        </button>
                    </div>
                    <button className={"publish-button"} onClick={() => this.toggleModal()}>Cancel</button>
                </dialog>
                <div className="left">
                    <span
                        className="mmm p-no-margin-bottom p-no-margin-top welcome">👋 Welcome back, {this.state.user.displayName}!</span>
                    {this.drawMessage(this.state.unpublished)}
                </div>
                <div className="right">
                    <button className="publish-button" onClick={() => this.updateProfile()}>Publish</button>
                    <button className="profile-button"
                            style={{backgroundImage: "url(" + config('HOST') + "/avatar/" + this.state.user.id + ".png?lr=" + this.state.lastReloaded}}>.
                    </button>
                </div>
            </div>
            <div className="dash-container2">
                <div className="left-component">
                    <EditPanel updateLocally={this.updateComponentLocally}
                               updateLocallyWithoutCancelling={this.updateComponentLocallyWithoutCancelling}
                               cancelSelection={this.cancelSelection}
                               updateLinks={this.updateLinks} displayMessage={this.displayMessage}
                               user={this.state.user} updateDisplayName={this.updateDisplayName}
                               reloadImage={this.reloadImage} ref={this.editPanel}
                               selectedComponent={this.getSelectedComponent(this.state.component)}/>
                </div>
                <div className="right-component">
                    <div className="profile-container">
                        <EditableProfile selectComponent={this.selectComponent}
                                         toggleModal={this.toggleModal} user={this.state.user}
                                         lastReloaded={this.state.lastReloaded}
                                         updateComponentOrder={this.updateComponentOrder}/>
                    </div>
                </div>
            </div>

        </div>
    }
}
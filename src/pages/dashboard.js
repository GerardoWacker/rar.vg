import React from "react";
import {tryLogout, tryUserLoading, updateProfile} from "../utils/session.util";
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
            lastReloaded: Date.now(),

            // Logout options
            single: "only",
        }

        this.editPanel = React.createRef()
        this.handleClickOutside = this.handleClickOutside.bind(this)
        this.changeInputValueRadio = this.changeInputValueRadio.bind(this)

    }

    handleClickOutside(event)
    {
        if (this.profOptions.current && !this.profOptions.current.contains(event.target))
        {
            this.props.onClickOutside && this.props.onClickOutside();
        }
    };

    onUnload = e =>
    {
        if (this.state.unpublished)
        {
            e.preventDefault();
            e.returnValue = 'You\'ve got unsaved changes! Are your sure you want to close?';
        }
    }

    componentWillUnmount()
    {
        window.removeEventListener("beforeunload", this.onUnload);
        document.addEventListener('click', this.handleClickOutside, true);
    }

    componentDidMount()
    {
        window.addEventListener("beforeunload", this.onUnload);
        tryUserLoading().then(response =>
        {
            if (!response.success)
                return window.location.href = "/login"

            this.setState({user: response.content.user})
        })
        document.addEventListener('click', this.handleClickOutside, true);

    }

    updateProfile = () =>
    {
        updateProfile(this.state.user.displayName, JSON.stringify(this.state.user.components), JSON.stringify(this.state.user.sociallinks))
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
        this.editPanel.current.handleNecessaryUpdates(this.getSelectedComponent(key))
    }

    cancelSelection = () =>
    {
        this.editPanel.current.clearState()
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
        oldUser.components[this.state.component].content = null
        this.setState({user: oldUser})
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

    deleteSelectedComponent = () =>
    {
        const oldUser = this.state.user;
        oldUser.components.splice(this.state.component, 1);
        this.setState({user: oldUser});
        this.displayMessage({type: 'important', message: "You've got unsaved changes!"}, true)
        this.cancelSelection()
        this.toggleRemoveComponentModal()
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
                break
            case 'pdf':
                newComponent.content = {fileId: null}
                break
            case 'linklist':
                newComponent.content = {
                    links: [{
                        "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        "icon": null,
                        "title": "This is a link"
                    }]
                }
                break
            case 'youtube':
                newComponent.content = 'dQw4w9WgXcQ'
                break
            case 'spotify':
                newComponent.content = '37i9dQZF1DXcBWIGoYBM5M'
                break
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

    showProfOptions = () =>
    {
        this.profOptions.open ? this.profOptions.close() : this.profOptions.showModal()
    }

    toggleModal = () =>
    {
        this.dialog.open ? this.dialog.close() : this.dialog.showModal()
    }

    toggleLogOutModal = () =>
    {
        this.profOptions.close()
        this.logoutConfirmation.open ? this.logoutConfirmation.close() : this.logoutConfirmation.showModal()
    }

    toggleRemoveComponentModal = () =>
    {
        this.removeComponentModal.open ? this.removeComponentModal.close() : this.removeComponentModal.showModal()
    }

    reloadImage = () =>
    {
        this.setState({lastReloaded: Date.now()})
    }

    /*handleClickOutside(event)
    {
        if (this.ref.current && !this.ref.current.contains(event.target))
        {
            this.props.onClickOutside && this.props.onClickOutside();
        }
    };*/

    changeInputValueRadio(event)
    {
        console.log(event.target.value)
        this.setState({single: event.target.value})
    }

    logout()
    {
        tryLogout(this.state.single === 'only').then(response =>
        {
            window.location.href = '/login?jr=' + (response.content.code || 4)
        })
    }

    render()
    {
        if (!this.state.user) return 'Loading...'
        return <div className="dashboard-container">
            <dialog className={"remove-component-modal"} ref={ref => this.removeComponentModal = ref}>
                <div className="question-remove">
                    <strong>Do you want to delete this component?</strong>
                </div>
                <div className="remove-component-modal-buttons-container">
                    <button className="remove-component-modal-button cancel"
                            onClick={() => this.toggleRemoveComponentModal()}>No, keep it
                    </button>
                    <button className="remove-component-modal-button done"
                            onClick={() => this.deleteSelectedComponent()}>Yes, delete
                    </button>
                </div>
            </dialog>
            <dialog className={"logout-modal"} ref={ref => this.logoutConfirmation = ref}>
                <div className="question-logout">
                    <span className={"m"}>Do you want to log out?</span>
                </div>

                <div className={"inner-mock2"}>
                    <label className="logout-option">
                        <input onChange={this.changeInputValueRadio} value={"only"}
                               checked={this.state.single === "only"} type={"radio"} name={"logout-options"}
                               className="circle-opt"></input>
                        <span className={"s"}>Log out of this device only</span>
                    </label>
                    <label className="logout-option">
                        <input onChange={this.changeInputValueRadio} value={"all"} checked={this.state.single === "all"}
                               type={"radio"} name={"logout-options"} className="circle-opt"></input>
                        <span className={"s"}>Log out of all devices (will close all of your sessions!)</span>
                    </label>
                </div>
                <div className="logout-modal-buttons-container">
                    <button className="logout-modal-button cancel" onClick={() => this.toggleLogOutModal()}>Cancel
                    </button>
                    <button className="logout-modal-button done"
                            onClick={() => this.logout()}>Done
                    </button>
                </div>
            </dialog>
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
                        <button onClick={() => this.addComponent('youtube')} className={"component-to-select s"}>YouTube
                            video player
                        </button>
                        <button onClick={() => this.addComponent('spotify')} className={"component-to-select s"}>Spotify
                            playlist player
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
                    <button className="profile-button" onClick={() => this.showProfOptions()}
                            style={{backgroundImage: "url(" + config('HOST') + "/avatar/" + this.state.user.id + ".png?lr=" + this.state.lastReloaded}}>.
                    </button>
                </div>
            </div>
            <div className="dash-container2">
                <dialog className="profile-popup" ref={ref => this.profOptions = ref}>
                    <div className="photo-dialog-div">
                        <button className="profile-button-dialog button unraised" onClick={() =>
                        {
                            this.selectComponent(-2)
                            this.profOptions.close()
                        }}
                                style={{backgroundImage: "url(" + config('HOST') + "/avatar/" + this.state.user.id + ".png?lr=" + this.state.lastReloaded}}>.
                        </button>
                    </div>
                    <br></br>
                    <div className="user-info">
                        <span className="mm">{this.state.user.displayName}</span>
                        <span className="s">@{this.state.user.username}</span>
                        <span className="ss"
                              style={{color: '#666'}}>{this.state.user.email.length < 25 ? this.state.user.email : this.state.user.email.slice(0, 25)}</span>
                    </div>
                    <hr style={{width: '100%'}}/>
                    <div>
                        <button className="button unraised cancel-button-dialog"
                                onClick={() => this.toggleLogOutModal()}>Log out
                        </button>
                    </div>
                </dialog>
                <div className="left-component">
                    <EditPanel updateLocally={this.updateComponentLocally}
                               updateLocallyWithoutCancelling={this.updateComponentLocallyWithoutCancelling}
                               cancelSelection={this.cancelSelection}
                               updateLinks={this.updateLinks} displayMessage={this.displayMessage}
                               user={this.state.user} updateDisplayName={this.updateDisplayName}
                               reloadImage={this.reloadImage} ref={this.editPanel}
                               selectedComponent={this.getSelectedComponent(this.state.component)}
                               deleteSelectedComponent={this.toggleRemoveComponentModal}/>
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
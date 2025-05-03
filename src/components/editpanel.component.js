import React from "react";
import {
    BsStars,
} from "react-icons/bs";
import "./editpanel.component.css"
import {styles} from "../pages/profileDesigns/colour.util";
import {IoIosList, IoMdAdd} from "react-icons/io";
import {AiOutlineGroup, AiOutlineUngroup} from "react-icons/ai";
import GenericPanel from "./panels/generic.panel.component";
import LinkListPanel from "./panels/linklist.panel.component";
import YoutubePanel from "./panels/youtube.panel.component";
import SpotifyPanel from "./panels/spotify.panel.component";
import PDFPanel from "./panels/pdf.panel.component";
import UserPanel from "./panels/user.panel.component";
import SocialLinksPanel from "./panels/sociallinks.panel.component";
import LinkPanel from "./panels/link.panel.component";
import DesignPanel from "./panels/design.panel.component";
import ColumnPanel from "./panels/column.panel.component";

const importAll = (r) => r.keys().map(r);
const postFiles = importAll(require.context("../news/", true, /\.md$/))
    .sort()
    .reverse();

export default class EditPanel extends React.Component
{
    toggleModal = () =>
    {
        this.props.toggleModal()
    }

    editProfile = () =>
    {
        this.props.selectComponent(-2)
    }

    editDesign = () =>
    {
        this.props.selectComponent(-3)
    }

    clearState = () =>
    {
        this.setState({
            title: "",
            description: "",
            linkField: "",
            selectedLink: null,
            linkList: [],
            selectedFile: null,
            fileMessage: null,
            displayName: "",
            userMessage: null,
            lastReloaded: Date.now(),
            selectedLinkListItem: null,
            linkItemTitleField: "",
            linkItemURLField: "",
            linkItemSelectedImage: null,
            linkItemMessage: null,
            spotifyMessage: null,
            spotifyLink: "",
            youtubeMessage: null,
            youtubeLink: "",
        })
    }

    handleNecessaryUpdates = (component) =>
    {
    }

    drawMessage(message)
    {
        if (message) return (
            <div className={"notice " + message.type}>
                {message.message}
            </div>
        )
    }

    saveLocally = (content) =>
    {
        this.props.updateLocally(content)
    }

    cancel = () =>
    {
        this.props.cancelSelection()
    }

    reorder = () =>
    {
        this.props.toggleReordering()
    }

    toggleGroup = () =>
    {
        this.props.toggleGrouping()
    }

    group = () =>
    {
        this.props.groupComponents().then(column => console.log(this.props.user))
    }

    renderFields = (component) =>
    {
        if (!component)
            return <div className={"default"}>
                <div className={(this.props.grouping ? "" : "grouping")}>
                    <span className={"m"}>Group components</span><br/><br/>
                    <span className={"s"}>Select components to group horizontally</span><br/>
                    <br/><br/>
                    <button className={'entry'} onClick={() => this.group()}>
                        <AiOutlineGroup size={20}/>
                        <span className={'s'}>Create group</span>
                    </button>
                    <button className={'entry stop-reorder'} onClick={() => this.toggleGroup()}>
                        <AiOutlineUngroup size={20}/>
                        <span className={'s'}>Stop grouping</span>
                    </button>
                </div>

                <div className={(this.props.reordering ? "" : (this.props.grouping ? "grouping" : "reordering"))}>
                    <span className={"m"}>Reorder mode</span><br/><br/>
                    <span className={"s"}>Drag and drop components to change its position</span><br/>
                    <span className={"s"}>Use the arrows to rearrange each component individually</span>
                    <br/><br/>
                    <button className={'entry stop-reorder'} onClick={() => this.reorder()}>
                        <IoIosList size={20}/>
                        <span className={'s'}>Stop reorder</span>
                    </button>
                </div>

                <div className={(this.props.reordering ? "reordering" : (this.props.grouping ? "grouping" : ""))}>
                    <span className={"m"}>Start editing</span><br/><br/>
                    <span className={"s"}>Click on a component to begin editing</span><br/>
                    <span className={"s"}>Toggle reorder to change a component's position</span>
                </div>

                <div
                    className={"lp-cont" + (this.props.reordering ? " reordering" : (this.props.grouping ? " grouping" : ""))}>
                    <span className={'m'}>Quick actions</span><br/><br/>
                    <button className={'entry'}
                            style={{
                                color: styles(this.props.user.profileDesign.colour || 0)["--profile-text-accent"],
                                backgroundColor: styles(this.props.user.profileDesign.colour || 0)["--card-background"],
                            }}
                            onClick={() => this.editDesign()}>
                        <span className={'s'}>Change profile design</span>
                    </button>
                    <button className={'entry'} onClick={() => this.reorder()}>
                        <IoIosList size={20}/>
                        <span className={'s'}>Reorder</span>
                    </button>
                    <button className={'entry'} onClick={() => this.toggleModal()}>
                        <IoMdAdd size={20}/>
                        <span className={'s'}>Add</span>
                    </button>
                    <button className={'entry special-generate'}>
                        <BsStars size={20}/><span className={'s'}>Generate</span>
                    </button>
                </div>
            </div>
        switch (component.type)
        {
            case 'user':
                return <UserPanel component={this.props.selectedComponent}
                                  drawMessage={this.drawMessage}
                                  deleteSelectedComponent={this.props.deleteSelectedComponent}
                                  cancel={this.cancel} saveLocally={this.saveLocally}
                                  updateDisplayName={this.props.updateDisplayName}
                                  reloadImage={this.props.reloadImage}
                                  user={this.props.user}
                />
            case 'design':
                return <DesignPanel
                    updateProfileDesign={this.props.updateProfileDesign}
                    updateProfileColours={this.props.updateProfileColours}
                    cancel={this.cancel}
                />
            case 'generic':
                return <GenericPanel component={this.props.selectedComponent}
                                     drawMessage={this.drawMessage}
                                     deleteSelectedComponent={this.props.deleteSelectedComponent}
                                     cancel={this.cancel} saveLocally={this.saveLocally}
                />
            case 'sociallinks':
                return <SocialLinksPanel component={this.props.selectedComponent}
                                         drawMessage={this.drawMessage}
                                         deleteSelectedComponent={this.props.deleteSelectedComponent}
                                         cancel={this.cancel} saveLocally={this.saveLocally}
                                         updateLocallyWithoutCancelling={this.props.updateLocallyWithoutCancelling}
                                         updateLinks={this.props.updateLinks} user={this.props.user}
                                         displayMessage={this.props.displayMessage}
                />
            case 'pdf':
                return <PDFPanel component={this.props.selectedComponent}
                                 drawMessage={this.drawMessage}
                                 deleteSelectedComponent={this.props.deleteSelectedComponent}
                                 cancel={this.cancel} saveLocally={this.saveLocally}
                                 updateLocallyWithoutCancelling={this.props.updateLocallyWithoutCancelling}
                />
            case 'link':
                return <LinkPanel component={this.props.selectedComponent} drawMessage={this.drawMessage}
                                  deleteSelectedComponent={this.props.deleteSelectedComponent}
                                  cancel={this.cancel} saveLocally={this.saveLocally}
                                  updateLocallyWithoutCancelling={this.props.updateLocallyWithoutCancelling}
                />
            case 'linklist':
                return <LinkListPanel component={this.props.selectedComponent}
                                      drawMessage={this.drawMessage}
                                      deleteSelectedComponent={this.props.deleteSelectedComponent}
                                      cancel={this.cancel} saveLocally={this.saveLocally}
                                      updateLocallyWithoutCancelling={this.props.updateLocallyWithoutCancelling}
                />
            case 'youtube':
                return <YoutubePanel component={this.props.selectedComponent}
                                     drawMessage={this.drawMessage}
                                     deleteSelectedComponent={this.props.deleteSelectedComponent}
                                     cancel={this.cancel} saveLocally={this.saveLocally}
                                     updateLocallyWithoutCancelling={this.props.updateLocallyWithoutCancelling}
                />
            case "spotify":
                return <SpotifyPanel component={this.props.selectedComponent}
                                     drawMessage={this.drawMessage}
                                     deleteSelectedComponent={this.props.deleteSelectedComponent}
                                     cancel={this.cancel} saveLocally={this.saveLocally}
                                     updateLocallyWithoutCancelling={this.props.updateLocallyWithoutCancelling}
                />
            case "column":
                return <ColumnPanel component={this.props.selectedComponent}
                                     drawMessage={this.drawMessage}
                                     deleteSelectedComponent={this.props.deleteSelectedComponent}
                                     cancel={this.cancel} saveLocally={this.saveLocally}
                                     updateLocallyWithoutCancelling={this.props.updateLocallyWithoutCancelling}
                />
        }
    }

    render()
    {
        return <div className="outer-mock">
            {this.renderFields(this.props.selectedComponent)}
        </div>
    }
}

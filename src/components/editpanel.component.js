import React from "react";
import {AiFillEdit, AiOutlineClose, AiOutlineCheck} from "react-icons/ai"
import {
    FaSteam,
    FaItunesNote,
    FaBitcoin,
    FaEthereum,
    FaDiscord,
    FaTiktok,
} from "react-icons/fa";
import {CgWebsite} from "react-icons/cg";
import {SiCashapp} from "react-icons/si";
import {
    BsSpotify,
    BsInstagram,
    BsTwitter,
    BsFacebook,
    BsGithub,
    BsTwitch,
    BsYoutube,
    BsLinkedin,
} from "react-icons/bs";
import "./editpanel.component.css"
import {upload} from "../utils/session.util";
import config from '../utils/config.util'

export default class EditPanel extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            // Generic component.
            title: "",
            description: "",
            // Social links.
            linkField: "",
            selectedLink: null,
            linkList: [],
            // PDF file.
            selectedFile: null,
            // User metadata.
            displayName: "",
            lastReloaded: Date.now()
        }

        this.handleTitleChange = this.handleTitleChange.bind(this)
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this)
        this.handleLinkFieldChange = this.handleLinkFieldChange.bind(this)
        this.handleDisplayNameChange = this.handleDisplayNameChange.bind(this)
    }

    icons = {
        steam: {
            icon: <FaSteam/>,
            link: "https://steamcommunity.com/id/",
        },
        itunes: {
            icon: <FaItunesNote/>,
            link: "https://music.apple.com/us/artist/",
        },
        bitcoin: {icon: <FaBitcoin/>, popup: true},
        ethereum: {icon: <FaEthereum/>, popup: true},
        discord: {icon: <FaDiscord/>, popup: true},
        tiktok: {icon: <FaTiktok/>, link: "https://www.tiktok.com/"},
        website: {icon: <CgWebsite/>, link: ""},
        cashapp: {icon: <SiCashapp/>, link: "https://cash.app/"},
        spotify: {
            icon: <BsSpotify/>,
            link: "https://open.spotify.com/artist/",
        },
        instagram: {
            icon: <BsInstagram/>,
            link: "https://instagram.com/",
        },
        twitter: {icon: <BsTwitter/>, link: "https://twitter.com/"},
        facebook: {icon: <BsFacebook/>, link: "https://facebook.com/"},
        github: {icon: <BsGithub/>, link: "https://github.com/"},
        twitch: {icon: <BsTwitch/>, link: "https://twitch.tv/"},
        youtube: {
            icon: <BsYoutube/>,
            link: "https://youtube.com/channel/",
        },
        linkedin: {
            icon: <BsLinkedin/>,
            link: "https://linkedin.com/in/",
        },
    };

    displayMessageInDashboard(message)
    {
        this.props.displayMessage(message)
    }

    linkEditItem = (link, key, selected) =>
    {
        return <div key={key} className="inner-mock">
            <div className="hero">{this.icons[link.name].icon}</div>
            {selected ?
                <div className={"link-content"}><input onChange={this.handleLinkFieldChange} defaultValue={link.content}
                                                       className="input"/>
                    <button className={"icon-button"} onClick={() => this.deselectItem()}><AiOutlineCheck/></button>
                </div> :
                <div className={"link-content"}><span>{link.content}</span>
                    <div className={"button-container"}>
                        <button className={"icon-button"} onClick={() => this.selectNewLink(key)}><AiFillEdit/></button>
                        <button className={"icon-button"} onClick={() => this.deleteItem(key)}><AiOutlineClose/>
                        </button>
                    </div>
                </div>}
        </div>
    }

    deselectItem = () =>
    {
        const oldLinks = this.props.user.sociallinks
        if (this.state.selectedLink !== null)
        {
            oldLinks[this.state.selectedLink].content = this.state.linkField
            this.props.updateLinks(oldLinks)
        }
        this.setState({selectedLink: null})

        this.displayMessageInDashboard({type: 'important', message: "You've got unsaved changes!"}, true)
    }

    deleteItem = (key) =>
    {
        const oldLinks = this.props.user.sociallinks
        oldLinks.splice(key, 1)
        this.props.updateLinks(oldLinks)

        this.displayMessageInDashboard({type: 'important', message: "You've got unsaved changes!"}, true)
    }

    selectNewLink = (key) =>
    {
        const oldLinks = this.props.user.sociallinks
        if (this.state.selectedLink !== null)
        {
            oldLinks[this.state.selectedLink].content = this.state.linkField
            this.props.updateLinks(oldLinks)
        }
        this.setState({linkField: oldLinks[key].content, selectedLink: key})
    }

    addNewItem = (item) =>
    {
        const oldLinks = this.props.user.sociallinks
        if (this.state.selectedLink !== null)
        {
            oldLinks[this.state.selectedLink].content = this.state.linkField
            this.setState({linkField: ''})
        }
        if (this.props.user.sociallinks.length < 8)
        {
            oldLinks.push({name: item, content: ''})
            this.setState({selectedLink: (oldLinks.length - 1)}, () => this.props.updateLinks(oldLinks))
        }
        this.displayMessageInDashboard({type: 'important', message: "You've got unsaved changes!"}, true)
    }

    drawIcons = () =>
    {
        return <div>
            {Object.keys(this.icons).map((item, key) => (
                <button key={key} className="icon-button"
                        onClick={() => this.addNewItem(item)}>{this.icons[item].icon}</button>
            ))}
        </div>
    }

    onFileChange = (event) =>
    {
        if (event.target.files && event.target.files[0])
        {
            this.setState({selectedFile: URL.createObjectURL(event.target.files[0])});
        }
    }

    uploadPDF = () =>
    {
        this.uploadingDialog.showModal()
        fetch(this.state.selectedFile).then(r => r.blob()).then(blob =>
        {
            const result = new File([blob], "theFile.pdf", {type: 'application/pdf'})
            upload(result, false).then(result =>
            {
                if (result.success)
                {
                    this.saveLocally({
                        fileId: result.content.split('.')[0]
                    })
                    this.uploadingDialog.close()
                }
            })
        })
    }

    handleTitleChange(event)
    {
        this.setState({title: event.target.value})
    }

    handleDescriptionChange(event)
    {
        this.setState({description: event.target.value})
    }

    handleLinkFieldChange(event)
    {
        this.setState({linkField: event.target.value})
    }

    handleDisplayNameChange(event)
    {
        this.setState({displayName: event.target.value})
    }

    onProfilePictureChange = (event) =>
    {
        if (event.target.files && event.target.files[0])
        {
            this.uploadingDialog.showModal()
            upload(event.target.files[0], true).then(result =>
            {
                if (result.success)
                {
                    this.props.reloadImage()
                    this.setState({lastReloaded: Date.now()})
                    this.uploadingDialog.close()
                }
            })
        }
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
                    <dialog ref={ref => this.uploadingDialog = ref} className={"dashboard-modal"}>
                        <span className={"m"}>Uploading...</span>
                    </dialog>
                    <h3 className="m p-no-margin-top p-no-margin-bottom">Edit user metadata</h3>
                    <div className="top">
                        <span className={"s p-no-margin-top"}>Profile picture:</span>
                        <div className="button-center">
                            <label style={{cursor: "pointer"}} for={"upload-profile-picture"}>
                                <div className="user-button"
                                     style={{backgroundImage: "url(" + config('HOST') + "/avatar/" + this.props.user.id + ".png?lr=" + this.state.lastReloaded}}/>
                            </label>
                            <label style={{cursor: "pointer"}} for={"upload-profile-picture"}>
                                <div className={"button unraised"} style={{width: "150px"}}><AiFillEdit size={16}/>Change
                                </div>
                            </label>
                            <input style={{display: "none"}} accept={".jpg,.png,.webp,.jpeg"} type={'file'}
                                   id={'upload-profile-picture'} onChange={this.onProfilePictureChange}/>
                            <span
                                className={"ss"}>Be careful! Profile pictures are published instantly when changed.</span>
                        </div>
                    </div>
                    <div className="bottom">
                        <h2 className="s p-no-margin-top">Display name:</h2>
                        <input className="input" type="text" defaultValue={this.props.user.displayName}
                               onChange={this.handleDisplayNameChange}/>
                        <div className={"button-container"}>
                            <button className="button unraised" onClick={() => this.cancel()}>Cancel</button>
                            <button className="button"
                                    onClick={() => this.props.updateDisplayName(this.state.displayName)}>Done
                            </button>
                        </div>
                        <h4 className={'mm p-no-margin-bottom'}>Danger zone</h4>
                        <button className="delete-button">Delete account</button>
                    </div>
                </>
            case 'generic':
                return <>
                    <h3 className="m p-no-margin-top p-no-margin-bottom">Edit generic component</h3>
                    <h2 className="s p-no-margin-bottom p-no-margin-top title">Title:</h2>
                    <input className="input" type="text" placeholder="Title" onChange={this.handleTitleChange}/>
                    <h2 className="s p-no-margin-bottom p-no-margin-top description">Description:</h2>
                    <textarea className="description-text-box-size" type="text"
                              placeholder="Description" onChange={this.handleDescriptionChange}/>
                    <div className={"button-container"}>
                        <button className="button unraised" onClick={() => this.cancel()}>Cancel</button>
                        <button className="button" onClick={() => this.saveLocally({
                            title: this.state.title,
                            description: this.state.description
                        })}>Done
                        </button>
                    </div>
                </>
            case 'sociallinks':
                return <>
                    <h3 className="m p-no-margin-top p-no-margin-bottom">Edit social links</h3>
                    <div className="icon-list-div">{this.drawIcons()}</div>
                    <h2 className="s p-no-margin-bottom p-no-margin-top title">Links:</h2>
                    {this.props.user.sociallinks.map((link, key) => (
                        <div>{this.linkEditItem(link, key, this.state.selectedLink === key)}</div>))}
                    <div className={"button-container"}>
                        <button className="button" onClick={() => this.cancel()}>Done< /button>
                    </div>
                </>
            case 'pdf':
                return <>
                    <dialog ref={ref => this.uploadingDialog = ref} className={"dashboard-modal"}>
                        <span className={"m"}>Uploading...</span>
                    </dialog>
                    <h3 className="m p-no-margin-top p-no-margin-bottom">Edit component</h3>
                    <div><label for="pdf-button" className="button-label">Upload PDF</label><input type={"file"} onChange={this.onFileChange} className="file-button" accept={".pdf"} id="pdf-button"/></div>
                    <p type="s">Only PDF files allowed!</p>
                    <div className="pdf" >
                        <object data={this.state.selectedFile}
                                type="application/pdf"></object>
                    </div>
                    <div className="button-container">
                        <button className="button unraised" onClick={() => this.cancel()}>Cancel</button>
                        <button className="button" onClick={() => this.uploadPDF()}>Upload</button>
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
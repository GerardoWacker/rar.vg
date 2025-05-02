import React from "react";

import {upload} from "../../utils/session.util";
import config from '../../utils/config.util'

export default class LinkPanel extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            linkTitleField: "",
            linkURLField: "",
            linkSelectedImage: null,
            linkMessage: null,
        }

        this.handleLinkURLChange = this.handleLinkURLChange.bind(this)
        this.handleLinkTitleChange = this.handleLinkTitleChange.bind(this)
    }

    componentDidMount()
    {
        this.setState({
            linkTitleField: this.props.component.content.title,
            linkURLField: this.props.component.content.url
        })
    }

    handleLinkTitleChange(event)
    {
        this.setState({linkTitleField: event.target.value})
    }

    handleLinkURLChange(event)
    {
        this.setState({linkURLField: event.target.value})
    }

    checkURLValidity(url)
    {
        let url_;

        try
        {
            url_ = new URL(url);
        } catch (_)
        {
            return false;
        }

        return url_.protocol === "http:" || url_.protocol === "https:";
    }

    updateLink = () =>
    {
        if (this.state.linkURLField === null)
        {
            return this.displayLinkMessage({type: 'error', message: 'Link field must not be empty!'})
        }
        if (this.checkURLValidity(this.state.linkURLField) === false)
        {
            return this.displayLinkMessage({type: 'error', message: 'Use the correct link format!'})
        }

        const newLink = {
            url: this.state.linkURLField,
            title: this.state.linkTitleField,
            icon: this.props.component.content.icon,
        }

        if (this.state.linkSelectedImage !== null)
        {
            return this.uploadLinkIcon().then(result =>
                {
                    newLink.icon = config('HOST') + "/uploads/" + result
                    this.props.saveLocally(newLink)
                }
            )
        }
        this.props.saveLocally(newLink)
    }

    onIconChange = (event) =>
    {
        if (event.target.files && event.target.files[0])
        {
            const allowedFiles = ['jpg', 'jpeg', 'png']
            if (event.target.files && event.target.files[0])
            {
                if (!allowedFiles.includes(event.target.files[0].name.split('.').pop()))
                    return this.displayLinkMessage({
                        type: 'error',
                        message: 'The selected file format is not allowed!'
                    })
                if (event.target.files[0].size / 1024 / 1024 > 1)
                    return this.displayLinkMessage({type: 'error', message: 'The selected file is too large!'})
                this.setState({linkSelectedImage: URL.createObjectURL(event.target.files[0])});
            }
        }
    }

    removeImage = () =>
    {
        this.setState({linkSelectedImage: null})
        this.props.component.content.icon = null
    }

    uploadLinkIcon = () =>
    {
        return new Promise(res =>
        {
            fetch(this.state.linkSelectedImage).then(r => r.blob()).then(blob =>
            {
                const result = new File([blob], "image.png", {type: 'application/png'})
                this.uploadingDialog.showModal()
                upload(result, false).then(result =>
                {
                    if (result.success)
                    {
                        this.uploadingDialog.close()
                        return res(result.content)
                    }
                })
            })
        })
    }

    displayLinkMessage = (message) =>
    {
        this.setState({linkMessage: message})
        setTimeout(() => this.setState({linkMessage: null}), 5000)
    }

    render()
    {
        const component = this.props.component.content
        if (component !== null)
            return <>
                <dialog ref={ref => this.uploadingDialog = ref} className={"dashboard-modal"}>
                    <span className={"m"}>Uploading...</span>
                </dialog>
                <h3 className="m p-no-margin-top p-no-margin-bottom">Edit link list</h3>
                {this.props.drawMessage(this.state.linkMessage)}
                <h2 className="s">Title:</h2>
                <input className="input" onChange={this.handleLinkTitleChange}
                       defaultValue={this.state.linkTitleField} type="text"
                       placeholder="My awesome link"/>
                <h2 className="s">Link:</h2>
                <input className="input" required onChange={this.handleLinkURLChange} type="url"
                       placeholder="https://yourwebsite.com" defaultValue={this.state.linkURLField}/>
                <h2 className="s">Icon:</h2>
                <div className={"button-center"}>
                    {this.state.linkSelectedImage !== null || component.icon !== null ? (
                        <>
                            <img className={"link-upload-icon"} src={this.state.linkSelectedImage || component.icon}
                                 alt={'Link icon'}/>
                            <button className="delete-icon-button" onClick={() => this.removeImage()}>Delete image
                            </button>
                        </>
                    ) : <></>
                    }
                    <label htmlFor="link-icon-button" className="button-label">Upload icon</label>
                    <input type={"file"} onChange={this.onIconChange} className="file-button"
                           accept={".jpg,.png,.jpeg"}
                           id="link-icon-button"/>
                </div>
                <div className={"button-container"}>
                    <button className="button delete-button"
                            onClick={() => this.props.deleteSelectedComponent()}>Delete component
                    </button>
                    <button className="button" onClick={() => this.updateLink()}>Done</button>
                </div>
            </>
        else return <div></div>
    }
}

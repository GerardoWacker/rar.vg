import './linklist.component.css'
import React from "react";
import LinkListItemComponent from "./linklistitem.component";

export default class LinkComponent extends React.Component
{
    constructor(props)
    {
        super(props)
    }

    render()
    {
        return <div className={this.props.editing ? 'component editing' : 'component'}>
            <div className={this.props.vertical ? "v-link-wrapper" : ""}>
                <LinkListItemComponent editing={this.props.editing}
                                       vertical={this.props.vertical}
                                       icon={this.props.icon} url={this.props.url}
                                       title={this.props.title}/>
            </div>
        </div>
    }
}

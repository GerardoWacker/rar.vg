import React from 'react'
import GenericComponent from "./generic.component";
import PDFComponent from "./pdf.component";
import LinklistComponent from "./linklist.component";
import SpotifyComponent from "./spotify.component";
import YouTubeComponent from "./youtube.component";
import LinkComponent from "./link.component";

import './column.component.css'

export default class ColumnComponent extends React.Component
{
    component = (component, key) =>
    {
        if (component.type && component.content)
            switch (component.type)
            {
                case "generic":
                    return <GenericComponent editing={true} title={component.content.title}
                                             description={component.content.description}
                                             key={key}/>
                case "pdf":
                    return <PDFComponent editing={true} fileId={component.content.fileId} key={key}/>
                case "linklist":
                    return <LinklistComponent editing={true} vertical={component.content.vertical}
                                              links={component.content.links}
                                              key={key}/>
                case 'spotify':
                    return <SpotifyComponent editing={true} id={component.content} key={key}/>
                case 'youtube':
                    return <YouTubeComponent editing={true} id={component.content} key={key}/>
                case 'link':
                    return <LinkComponent editing={true} vertical={component.content.vertical}
                                          icon={component.content.icon}
                                          url={component.content.url}
                                          title={component.content.title} key={key}/>
                case 'column':
                    return <ColumnComponent editing={true} components={component.content} key={key}/>
            }
    }

    render()
    {
        console.log(this.props)
        return <div className={"column-component-base" + (this.props.editing ? " editing" : "")}>
            {this.props.components.map((component, key) =>
                (
                    <div
                        className={'column-item-container' +
                            (key === 0 ? ' no-margin-left' :
                                (key === this.props.components.length - 1 ? ' no-margin-right' : ''))}
                        key={key} style={{width: (100 / this.props.components.length) + "%"}}>
                        {this.component(component, key)}
                    </div>
                ))}
        </div>
    }
}
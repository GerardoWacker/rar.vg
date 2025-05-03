import React from "react";
import GenericPanel from "./generic.panel.component";
import SocialLinksPanel from "./sociallinks.panel.component";
import PDFPanel from "./pdf.panel.component";
import LinkPanel from "./link.panel.component";
import LinkListPanel from "./linklist.panel.component";
import YoutubePanel from "./youtube.panel.component";
import SpotifyPanel from "./spotify.panel.component";

export default class ColumnPanel extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            selected: null
        }
    }

    select = (key) =>
    {
        this.setState({selected: key})
    }

    unselect = (key) =>
    {
        this.setState({selected: null})
    }

    listComponents = (components) =>
    {
        return <div>
            {
                components.map((component, key) =>
                    (
                        <button onClick={() => this.select(key)}>Edit {component.type}</button>
                    ))
            }
        </div>
    }

    renderEditor = (componentId) =>
    {
        if (componentId === null) return <div>Select a component</div>
        let component = this.props.component.content[componentId]
        switch (component.type)
        {
            case 'generic':
                return <GenericPanel component={component}
                                     drawMessage={this.props.drawMessage}
                                     deleteSelectedComponent={this.props.deleteSelectedComponent}
                                     cancel={this.cancel} saveLocally={this.saveLocally}
                />
            case 'pdf':
                return <PDFPanel component={component}
                                 drawMessage={this.props.drawMessage}
                                 deleteSelectedComponent={this.props.deleteSelectedComponent}
                                 cancel={this.cancel} saveLocally={this.saveLocally}
                                 updateLocallyWithoutCancelling={this.props.updateLocallyWithoutCancelling}
                />
            case 'link':
                return <LinkPanel component={component} drawMessage={this.props.drawMessage}
                                  deleteSelectedComponent={this.props.deleteSelectedComponent}
                                  cancel={this.cancel} saveLocally={this.saveLocally}
                                  updateLocallyWithoutCancelling={this.props.updateLocallyWithoutCancelling}
                />
            case 'linklist':
                return <LinkListPanel component={component}
                                      drawMessage={this.props.drawMessage}
                                      deleteSelectedComponent={this.props.deleteSelectedComponent}
                                      cancel={this.cancel} saveLocally={this.saveLocally}
                                      updateLocallyWithoutCancelling={this.props.updateLocallyWithoutCancelling}
                />
            case 'youtube':
                return <YoutubePanel component={component}
                                     drawMessage={this.props.drawMessage}
                                     deleteSelectedComponent={this.props.deleteSelectedComponent}
                                     cancel={this.cancel} saveLocally={this.saveLocally}
                                     updateLocallyWithoutCancelling={this.props.updateLocallyWithoutCancelling}
                />
            case "spotify":
                return <SpotifyPanel component={component}
                                     drawMessage={this.props.drawMessage}
                                     deleteSelectedComponent={this.props.deleteSelectedComponent}
                                     cancel={this.cancel} saveLocally={this.saveLocally}
                                     updateLocallyWithoutCancelling={this.props.updateLocallyWithoutCancelling}
                />
        }
    }

    render()
    {
        return <div>
            {this.listComponents(this.props.component.content)}
            {this.renderEditor(this.state.selected)}
        </div>
    }
}
import React, { Component } from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";

import { Elapsed, formatTime } from "./elapsed";
import { default as Status, StatusText } from "shared/components/status";

import styles from "./procs.less";

const renderEnviron = data => {
  return (
    <div>
      {data[0]}={data[1]}
    </div>
  );
};

class ProcListHolder extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { open: !this.props.renderName };
  }

  toggleOpen = () => {
    this.setState({ open: !this.state.open });
  };

  render() {
    const { vars, children } = this.props;
    const groupExpandStatus = this.state.open
      ? styles.collapsed
      : styles.expanded;

    let name = (
      <div>
        <div>{vars.name === "woodpecker" ? "default" : vars.name}</div>
        {vars.environ ? Object.entries(vars.environ).map(renderEnviron) : ""}
      </div>
    );

    return (
      <div className={styles.list}>
        <div
          onClick={this.toggleOpen}
          className={`${styles.group} ${groupExpandStatus}`}
        >
          <StatusText status={vars.state} text={name} />
        </div>
        <div className={!this.state.open ? styles.hide : ""}>{children}</div>
      </div>
    );
  }
}

export class ProcList extends Component {
  render() {
    const { repo, build, rootProc, selectedProc, renderName } = this.props;
    return (
      <ProcListHolder vars={rootProc} renderName={renderName}>
        {this.props.rootProc.children.map(function(child) {
          return (
            <Link
              to={`/${repo.full_name}/${build.number}/${child.pid}`}
              key={`${repo.full_name}-${build.number}-${child.pid}`}
            >
              <ProcListItem
                key={child.pid}
                name={child.name}
                start={child.start_time}
                finish={child.end_time}
                state={child.state}
                selected={child.pid === selectedProc.pid}
              />
            </Link>
          );
        })}
      </ProcListHolder>
    );
  }
}

export const ProcListItem = ({ name, start, finish, state, selected }) => (
  <div className={classnames(styles.item, selected ? styles.selected : null)}>
    <h3>{name}</h3>
    {finish ? (
      <time>{formatTime(finish, start)}</time>
    ) : (
      <Elapsed start={start} />
    )}
    <div>
      <Status status={state} />
    </div>
  </div>
);

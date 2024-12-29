import React from "react";

const Connected = (props) => {
    return (
        <div className="connected-container">
            <h1 className="connected-header">You are Connected to MetaMask</h1>
            <p className="connected-account">MetaMask Account: {props.account}</p>
            <p className="connected-account">Remaining Time: {props.remainingTime} seconds</p>
            { !props.showButton ? (
                <p className="connected-account">You have already voted</p>
            ) : (
                <div>
                    <input
                        type="number"
                        placeholder="Enter Candidate Index"
                        value={props.number}
                        onChange={props.handleNumberChange}
                    />
                    <br />
                    <button className="login-button" onClick={props.voteFunction}>Vote</button>
                </div>
            )}
            <table id="myTable" className="candidates-table">
                <thead>
                    <tr>
                        <th>Index</th>
                        <th>Candidate Name</th>
                        <th>Candidate Votes</th>
                    </tr>
                </thead>
                <tbody>
                    {props.candidates.map((candidate, index) => (
                        <tr key={index}>
                            <td>{candidate.index}</td>
                            <td>{candidate.name}</td>
                            <td>{candidate.voteCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Connected;
/** @jsx React.DOM */

var TimePicker = React.createClass({
    newNameChanged: function (e) {
        this.setState({ name: e.target.value });
    },
    newEmailChanged: function (e) {
        this.setState({ email: e.target.value });
    },
    hoursChanged: function (e) {
        var newHours = +e.target.value;
        this.props.onChange({ hours: newHours, minutes: this.props.value.minutes });
    },
    minutesChanged: function (e) {
        var newMinutes = +e.target.value;
        //TODO: maybe check for onChange handler, or update state instead.
        this.props.onChange({ hours: this.props.value.hours, minutes: newMinutes });
    },
    render: function () {
        return (
            <div className="timepicker">
                <input type="number" min="0" max="23" value={this.props.value.hours} onChange={this.hoursChanged} />
                {":"}
                <input type="number" min="0" max="59" step="5" value={this.props.value.minutes} onChange={this.minutesChanged} />
            </div>
        );
    }
});

var TimePickerTest = React.createClass({
    getInitialState: function () {
        return {time: {hours: 10, minutes: 40}};
    },
    handleTimeChange: function (newValue) {
        this.setState({time: newValue});
    },
    render: function () {
        return (
            <TimePicker value={this.state.time} onChange={this.handleTimeChange} />
        );
    }
});

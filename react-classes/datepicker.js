/** @jsx React.DOM */

var DatePicker = React.createClass({
    getInitialState: function () {
        var state = {active: true};
        if (!this.props.value) {
            state.value = new Date();
        }
        return state;
    },
    toggleActive: function () {
        this.setState({
            active: !this.state.active
        });
    },
    signalChange: function (newValue) {
        if (!this.props.includeTime) {
            newValue.setHours(0, 0, 0, 0);
        }
        if (!this.props.value) {
            this.setState({ value: newValue });
        }
        this.props.onChange && this.props.onChange(newValue);
    },
    monthChange: function (change) {
        var newDate = this.getValue();
        var newMonth = newDate.getMonth() + change;

        //set the last day if coming in to short month with big date.
        var daysOfMonth = AVDate.daysOfMonth(newDate.getYear(), newMonth + 1);
        newDate.setDate(Math.min(newDate.getDate(), daysOfMonth));

        newDate.setMonth(newMonth);
        this.signalChange(newDate);
    },
    dateChanged: function (newDate) {
        var previous = this.getValue();
        newDate.setHours(previous.getHours(), previous.getMinutes());
        this.signalChange(newDate);
    },
    getValue: function () {
        //if value is set use that, otherwise internal state
        return new Date(this.props.value || this.state.value);
    },
    timeChanged: function (newTime) {
        var newDate = this.getValue();
        newDate.setHours(newTime.hours, newTime.minutes);
        this.signalChange(newDate);
    },
    render: function () {
        var timePicker, value, year, month, day;
        value = this.getValue();
        year = value.getFullYear();
        month = value.getMonth();
        day = value.getDate();
        if (this.props.includeTime) {
            timePicker = <TimePicker value={{"hours": value.getHours(), "minutes": value.getMinutes() }} onChange={this.timeChanged} />;
        }
        return (
            <div className="datepicker">
                <div className="datepicker-header" >
                    <div onClick={this.toggleActive}>
                        {AVDate.formatDate("D, Y-m-d", value)}
                    </div>
                    {timePicker}
                </div>
                <div style={{display: this.state.active ? "block" : "none"}} >
                    <div className="month-header">
                        <div className="month-switch" onClick={this.monthChange.bind(this, -1)}>{"<<"}</div>
                        <div className="title">{AVDate.nameOfMonth(month) + " " + year}</div>
                        <div className="month-switch" onClick={this.monthChange.bind(this, 1)}>{">>"}</div>
                    </div>
                    <MonthView month={month} year={year} date={value} onChange={this.dateChanged}/>
                </div>
            </div>
        );
    }
});

var DatePickerTest = React.createClass({
    getInitialState: function () {
        return {date1: new Date(), date2: new Date(1000000)};
    },
    handleDate1Change: function (newValue) {
        this.setState({date1: newValue});
    },
    handleDate2Change: function (newValue) {
        this.setState({date2: newValue});
    },
    render: function () {
        return (
            <div>
                <DatePicker title="Start date" includeTime={true} value={this.state.date1} onChange={this.handleDate1Change} />
            </div>
        );
    }
});

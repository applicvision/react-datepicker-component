/** @jsx React.DOM */

var MonthView = React.createClass({
    getDateCell: function (date) {
        var day = date.getDate();
        classes = React.addons.classSet({
            datecell: true,
            nonmember: date.getMonth() !== this.props.month,
            today: AVDate.isToday(date),
            selected: AVDate.sameDay(date, this.props.date)
        });
        return <div className={classes} onClick={this.props.onChange.bind(this, date)} >{day}</div>;
    },
    getWeekdayRow: function () {
        var row = [<div/>];
        var dayRow = AVDate.dayNames(2).map(function (name) {
            return <div className="weekday">{name}</div>;
        });
        return <div className="month-view-row">{row.concat(dayRow)}</div>
    },
    getWeekRow: function (date) {
        var row = [<div className="weeknumber">v.{AVDate.getWeekNumber(date)}</div>];
        var days = AVDate.weekArrayForDate(date).map(function (aDate) {
            return this.getDateCell(aDate);
        }.bind(this));
        return <div className="month-view-row">{row.concat(days)}</div>;
    },
    getTable: function () {
        var date = new Date(this.props.year, this.props.month, 1);
        var table = [this.getWeekdayRow()];
        while (date.getMonth() === this.props.month || AVDate.weekStart(date).getMonth() === this.props.month) {
            table.push(this.getWeekRow(date));
            date = AVDate.nextWeekStart(date);
        }
        return table;
    },
    render: function () {
        return (
            <div className="monthview">
                {this.getTable()}
            </div>
        );
    }
});

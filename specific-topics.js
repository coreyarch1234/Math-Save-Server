
//import problem model
const Problem = require('./models/problem');

module.exports = () => {
    var specificTopics = {}
    return (
        Problem.find({}, (err, problems) => {
            if (!err) {
                return problems;
            }
            console.log(err);
        }).then((problems) => {
            specificTopics['Algebra'] = problems.filter(problem => problem.title == 'Algebra');
            specificTopics['Calculus'] = problems.filter(problem => problem.title == 'Calculus');
            specificTopics['Any'] = problems.filter(problem => problem.title != 'Calculus' || problem.title != 'Algebra');
            return specificTopics
        })
    )
}

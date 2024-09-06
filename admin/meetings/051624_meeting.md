## Attendees
- Advaith
- Ned
- Aarav
- Minyang
- David
- Jim
- Jaewan
- Patric

## Absent
- Po-cheng
- Slater

## Agenda
- Go over issues
- Assign them to people

## Notes
- Advaith
  - Went over Github Issue Formatting
  - Reaon for design
     - No merge conflicts
     - Specific Design
- Feedback from team: All good
- Discussed JSON formatting for localStorage. Consesnus agreement for the following format

```
{ 
current_project: project_n, 
current_date: MM/DD/YYYY
project_data: {
     project_1: {
          projectName: Name, 
          projectTag: Tag, 
          projectContributors: contributors, 
          projectDescription: Description, 
          active: true/false,
          logs: {log_1: {data: BLANK, time: HH:MM, day: DD, Month: MM, Year: YYYY, title: TEXT, contributors: Text}, ...}, 
          BranchLink: link,
          TodoList: {task1: description}
     project_2: ... }
}
```

## TODO
- Ned and Po-cheng
   - Finish template design
- Advaith
   - Write up MonthPage and WeekPage Issue
   - Assign all issues
- Everyone Else
   - Start Work on Issue  

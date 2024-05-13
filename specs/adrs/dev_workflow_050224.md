# Dev Workflow Procedure Brainstorming

## Context and Problem Statement

We have an assigned team, and we need to come up with a mechanism to maintain and progress with developer workflow, including planning, writing and assigning issues to individuals towards project-completion.

## Considered Options

1. Developers will have access to main and can commit to main directly
2. Developers will work on a branch of main and make changes to that sub-branch, and team-leads approve the creation of specific sub-branches so as to not overpopulate the workflow with tons of branches and make it less confusing.
3. Sub team-leads will take the responsibility of planning, writing, and assigning Github Issues
4. All team members will have the option to plan, write, and assign Github Issues

## Decision Outcome

2. Developers work on sub-branches of main - This is just better developer workflow practice in general, and commits to main can potentially introduce bugs or conflicts with other changes being made simultaneously by other team members.

3. Leads(Advaith, Ned for Back-End, and Po-Cheng for Front-end) are responsible for planning, writing, and assigning Github Issues to developers. It is prefereable to have individuals to manage the development progress w.r.t. front-end/back-end and be involved in developer workflow.


<!-- This is an optional element. Feel free to remove. -->
### Consequences

* Good, as this is conventional workflow practice to a large extent.
* Bad, an area for concern for point **3** is that communication has to be good and effective for it to be successful. Developers and leads should have a strong rapport.

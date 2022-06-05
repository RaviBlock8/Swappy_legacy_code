# Contributing Guidelines

The following document contains guidelines for branching and commiting that need to be following while contributing to the project.

## Commit

### The seven rules of a great Git commit message 
* **Separate subject from body with a blank line**
    A commit message is usually divided into 2 parts that are subject and description, It is a good idea to begin the commit message with a single short (less than 50 character) line summarising the change, followed by a blank line and then a more thorough description. The text up to the first blank line in a commit message is treated as the commit title, and that title is used throughout Git. For example, Git-format-patch(1) turns a commit into email, and it uses the title on the Subject line and the rest of the commit in the body.

* **Limit the subject line to 50 characters**
    Many repository hosting services like github and gitlab have an upper limit for displaying the length of the commit message, for github it is 72 characters, the rest if the message is truncated
    So 50 characters is not a hard bound limit but kind of a rule of thumb for writing commit messages, which makes them more readable and understandable

* **Capitalise the subject line**
    This rule does not have any specific reason, it is just a practice that our organisation follows to achieve consistency in the way we write commits. 

* **Do not end the subject line with a period**
    Trailing punctuation is unnecessary in subject lines. Besides, space is precious when you’re trying to keep them to 50 chars or less.
    Example:
    Open the pod bay doors
    Instead of:
    Open the pod bay doors.

* **Use the imperative mood in the subject line**
    Imperative mood just means “spoken or written as if giving a command or instruction”. 
    Each of the seven rules you’re reading about right now are written in the imperative (“Wrap the body at 72 characters”, etc.).
    The use of Imperative mood is a common practice to follow across git users, mainly because git itself uses imperative move when it write commits like,
    ```
    Merge branch 'myfeature'
    or

    Revert "Add the thing with the stuff"

    This reverts commit cc87791524aedd593cff5a74532befe7ab69ce9d.
    ```
    A properly formed Git commit subject line should always be able to complete the following sentence:
    If applied, this commit will **your subject line here**
    For example:
    If applied, this commit will refactor subsystem X for readability (Correct)
    If applied, the commit will refactored subsystem X for readability (Incorrect)

* **Wrap the body at 72 characters**
    Git never wraps text automatically. When you write the body of a commit message, you must mind its right margin, and wrap text manually.
    The recommendation is to do this at 72 characters, so that Git has plenty of room to indent text while still keeping everything under 80 characters overall.

* **Use the body to explain what and why vs. how**
    In most cases, you can leave out details about how a change has been made. Code is generally self-explanatory in this regard (and if the code is so complex that it needs to be explained in prose, that’s what source comments are for). Just focus on making clear the reasons why you made the change in the first place—the way things worked before the change (and what was wrong with that), the way they work now, and why you decided to solve it the way you did.

    The future maintainer that thanks you may be yourself   

## Branch
For efficient management and collaboration of multiple developers on the same project a proper branching structure is mandatory. At our organisation we maintain the following branching structure and syntax

### The main branches 
At the core, the development model is greatly inspired by existing models out there. The central repo holds two main branches with an infinite lifetime:

* master
* develop

Supporting branches 
The different types of branches we use are:

* feature
* bug
* hotfix
* release


#### Feature Branch
Feature branches are used for the development of new features/enhancements that might add some new functionality to the project or might improve its structure or readability.

May branch off from:

develop

Must merge back into:

develop


**Branch naming convention:**
```
feature/{project keyword}-{feature ticket}-some-feature-keywords
example:

feature/swap-144-add-ajv-validations-to-employee-model
Project keyword can be a set of initials that are unique for that project in the organisation, for example for a project named Enosi the project keywork can be en
```
 
#### Bug Branch
Bug branches are used to solve issues that might cause inappropriate functioning of a project, they are almost similar in terms or syntax and management, to feature branches.

**Branch naming convention:**
```
bug/{project keyword}-{feature ticket}-some-feature-keywords
example:

bug/lms-144-unable-to-fetch-monthly-leaves
```
 
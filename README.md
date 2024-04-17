# Canny Debugging Test

Howdy Candidate, we've created this pared down version of Canny to get a better idea of your experience debugging web applications. Best of luck!

## Getting Started

1. **Initialize your environment**

We recommend using nvm for managing node versions.

Install nvm from [here](https://github.com/creationix/nvm)

Then install the node version for this assessment:

```sh
nvm i
```

1. **Install dependencies**

Next you'll need to install this app

```sh
npm install
```

1. **Run the backend**

The backend is a node server. Everything to do with the server lives in `/server`.

Terminal tab #1:

```sh
npm run backend
```

1. **Run the frontend**

Webpack is used to bundle and serve our app. Everything to do with the frontend lives in `/app`.

Terminal tab #2:

```sh
npm run frontend
```

Once everything is running, you should see the app running http://127.0.0.1:8080.

## Customer Issues

For each of the following issues:

1. Identify the issue
1. Apply the fix
1. Provide a response to each technical customer in 1-2 sentences

**Customer 1:** When I open the application, my posts do not load and all I see is a 'server error'.

# Solution:

    When launching the application, I encountered an issue where my posts failed to load, and instead, a 'server error' message was displayed. Initially, this error was hard-coded within the error method in the Request.js file. However, after modifying the hard-coded message to be 'error: error', it provided more insight into the underlying issue. Upon further investigation, I discovered that the actual error stemmed from the authenticateUser.js file, specifically an "Authentication error: Error: Missing name in user data" error.

    Upon logging the userData object, I observed the following decoded user data:
    Decoded user data: {
        email: 'user@email.com',
        id: 'user.id',
        nayme: 'user.name',
        iat: 1609973239
    }

    It became apparent that the field containing the user's name was mistakenly labeled as 'nayme' instead of 'name'. Rectifying this discrepancy within the authenticateUser.js file by replacing name with nayme resolved the server error:
    if (!userData.nayme) {
        throw new Error("Missing name in user data");
    }

**Customer 2:** When I click on "Top" or "Old", the selector does not update with my new selection.

# Solution:

    On Inspecting, I identifield that issue lies in 'onChangeSort' method. The method toggles 'menuOpen' state to close the dropdown but change in sorting isn't reflected immediently.
    To fix this, after toggling 'menuOpen' state, 'changeSort' method is called tp update the sorting option.

    onChangeSort = (sort) => {
        this.setState({ menuOpen: false });
        this.props.changeSort(sort);
    };

**Customer 3:** When I sort by "Top", there are posts with only 28 votes ranking higher than posts with 180 votes!

# Solution:

    The "PostsLoaded" method was lacking sorting functionality based on votes. By incorporating sorting logic into the "PostsLoaded" method, this issue was resolved:

    posts.sort((a, b) => b.votes - a.votes);

**Customer 4:** When I page through posts, although the posts are changing, the vote count in the top left corner does not match the total count of votes of the displayed posts.

# Solution:

    Currently, Vote count is calculated only once during 'Recountvotes' action, which is dispatched after posts ate loaded. However this is not updateing the total votes of the displayed posts. This is fixed by recalculating the total count whenever the posts are loaded or changed by moving 'Reduce()' to 'PostsLoaded' method.

    const votes = action.posts.reduce((prev, post) => prev + post.votes, 0);

## 🎉 You're Done 🎉

Congrats on completing our assessment. All that is left for you to do is submit your assessment. We made a command that will zip your submission and send it to us. Send us an email to confirm that we got it.

```sh
npm run submit
```

# MDReact

A basic clone of React for learning purpose

The whole process can be summarized in the following steps.

1. Create a tree of objects with each node representing an element in the UI (virtual dom). Not technically a tree, since parent, child, and siblings are connected for faster access. It is known as a fiber tree in react.

2. Divide the rendering process into smaller chunks, so as to not block the main thread for too long. High priority stuff like handling user input or keeping an animation smooth won’t be blocked.

3. Traverse the tree and add nodes to the html DOM on initial render. Keep a copy of the virtual dom tree to track updates.

4. Keep the state of the nodes within the objects itself.

5. On any update to the state, we would check each node and it’s previous counterpart to see if that particular node needs to be added, deleted, or updated. We keep the actions in the work in progress fiber ( addition/deletion/updation ).

6. Finally, on subsequent renders we check the action assigned to the fiber node and make the changes to the dom.

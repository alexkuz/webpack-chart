function reduceAngleTree(angleTree, slice, sum, level, limit) {
  const angle = (slice.value / sum) * 360;
  const percentValue = (slice.value / sum) * 100;

  return {
    angle: angleTree.angle + angle,
    tree: [...angleTree.tree, {
      data: slice,
      start: angleTree.angle,
      end: angleTree.angle + angle,
      level: level,
      value: slice.value,
      percentValue: percentValue
    }, ...(
      level < limit && slice.children ?
        slice.children.reduce(
          (at, s) => reduceAngleTree(at, s, sum, level + 1, limit),
          { angle: angleTree.angle, tree: [] }
        ).tree :
        []
    )]
  };
}

export default function createSliceTree(data, limit) {
  const sum = data.value;

  const tree = data.children.reduce(
    (angleTree, slice) => reduceAngleTree(angleTree, slice, sum, 1, limit),
    { angle: 0, tree: [] }
  ).tree;

  return [
    ...tree.reduce(
      (t, slice) => {
        t[slice.level - 1] = [...(t[slice.level - 1] || []), slice];
        return t;
      },
      []
    ).map((slices, idx) => ({ level: idx + 1, slices: slices }))
    .sort((a, b) => b.level - a.level),
    {
      level: 0,
      slices: [{
        data: data,
        start: 0,
        end: 360,
        value: sum,
        percentValue: 100,
        level: 0
      }]
    }
  ];
}

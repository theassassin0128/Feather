async function getMemberCount(client) {
  let memberCount = 0;

  client.guilds.cache.forEach((guild) => {
    memberCount += guild.memberCount;
  });

  return memberCount;
}

module.exports = { getMemberCount };

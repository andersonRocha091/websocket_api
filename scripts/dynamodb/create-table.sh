aws \
--endpoint-url=http://localhost:4566 \
dynamodb create-table --table-name WebsocketUsers --attribute-definitions AttributeName=ID,AttributeType=S --key-schema AttributeName=ID,KeyType=HASH --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5